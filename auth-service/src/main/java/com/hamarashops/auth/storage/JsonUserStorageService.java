package com.hamarashops.auth.storage;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.hamarashops.auth.exception.OAuthAuthenticationException;
import com.hamarashops.auth.model.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Service managing user record persistence in JSON format.
 * Features safe read/write synchronization, atomic persistence, GCS precondition concurrency protection,
 * and corruption safeguards.
 *
 * SENSITIVITY SAFEGUARD: Never stores access tokens, ID tokens, client secrets, or JWT secrets.
 */
@Service
public class JsonUserStorageService {

    private static final Logger log = LoggerFactory.getLogger(JsonUserStorageService.class);

    private final FileStorageService fileStorageService;
    private final String jsonPath;
    private final ObjectMapper objectMapper;
    private final java.time.Clock clock;

    @org.springframework.beans.factory.annotation.Autowired
    public JsonUserStorageService(
            FileStorageService fileStorageService,
            @Value("${storage.local.json-path:data/linkedin-users.json}") String localJsonPath,
            @Value("${storage.gcs.json-path:auth/linkedin-users.json}") String gcsJsonPath,
            @Value("${storage.type:LOCAL}") String storageType,
            java.time.Clock clock) {

        this.fileStorageService = fileStorageService;
        this.jsonPath = "GCS".equalsIgnoreCase(storageType) ? gcsJsonPath : localJsonPath;
        this.clock = clock != null ? clock : java.time.Clock.systemUTC();

        this.objectMapper = new ObjectMapper();
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

        log.info("Initialized JsonUserStorageService with path: {}", fileStorageService.resolveReadableLocation(this.jsonPath));
    }

    public JsonUserStorageService(
            FileStorageService fileStorageService,
            String localJsonPath,
            String gcsJsonPath,
            String storageType) {
        this(fileStorageService, localJsonPath, gcsJsonPath, storageType, java.time.Clock.systemUTC());
    }

    public synchronized User upsertUser(
            String linkedinId,
            String email,
            Boolean emailVerified,
            String firstName,
            String lastName,
            String name,
            String pictureUrl) {
        return upsertUser(linkedinId, email, emailVerified, firstName, lastName, name, pictureUrl, null);
    }

    /**
     * Atomically adds a new user or updates an existing user by LinkedIn ID.
     * Uses updateWithRetry for optimistic concurrency protection across instances.
     */
    public synchronized User upsertUser(
            String linkedinId,
            String email,
            Boolean emailVerified,
            String firstName,
            String lastName,
            String name,
            String pictureUrl,
            String linkedinProfileUrl) {

        if (linkedinId == null || linkedinId.trim().isEmpty()) {
            throw new OAuthAuthenticationException("Missing LinkedIn subject identifier (sub).");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new OAuthAuthenticationException("Missing email address in LinkedIn profile claims.");
        }

        String normalizedEmail = email.toLowerCase().trim();
        String now = clock.instant().toString();
        AtomicReference<User> resultUser = new AtomicReference<>();

        try {
            fileStorageService.updateWithRetry(jsonPath, currentBytes -> {
                List<User> users;
                if (currentBytes == null || currentBytes.length == 0) {
                    users = new ArrayList<>();
                } else {
                    try {
                        users = objectMapper.readValue(currentBytes, new TypeReference<List<User>>() {});
                    } catch (Exception e) {
                        log.error("CRITICAL: Failed to parse user records from JSON file at {}: {}", jsonPath, e.getMessage());
                        // Never overwrite or replace corrupted files
                        throw new IllegalStateException("Corrupted or unreadable JSON user storage file at: " + jsonPath + ". Manual inspection required.", e);
                    }
                }

                // 1. Search by LinkedIn ID (Repeat login)
                for (User existing : users) {
                    if (linkedinId.equals(existing.getLinkedinId())) {
                        log.info("Existing LinkedIn user detected (ID: {}). Updating profile and updatedAt timestamp.", existing.getId());
                        if (name != null) existing.setName(name);
                        if (firstName != null) existing.setFirstName(firstName);
                        if (lastName != null) existing.setLastName(lastName);
                        if (pictureUrl != null) existing.setPictureUrl(pictureUrl);
                        if (linkedinProfileUrl != null) existing.setLinkedinProfileUrl(linkedinProfileUrl);
                        if (emailVerified != null) existing.setEmailVerified(emailVerified);
                        if (email != null) existing.setEmail(normalizedEmail);
                        existing.setUpdatedAt(now);

                        resultUser.set(existing);
                        return objectMapper.writeValueAsBytes(users);
                    }
                }

                // 2. Search by verified email (Account Linking)
                for (User existing : users) {
                    if (normalizedEmail.equalsIgnoreCase(existing.getEmail())) {
                        if (Boolean.TRUE.equals(emailVerified)) {
                            log.info("Linking LinkedIn ID to existing verified account (ID: {})", existing.getId());
                            existing.setLinkedinId(linkedinId);
                            if (pictureUrl != null && existing.getPictureUrl() == null) {
                                existing.setPictureUrl(pictureUrl);
                            }
                            if (linkedinProfileUrl != null && existing.getLinkedinProfileUrl() == null) {
                                existing.setLinkedinProfileUrl(linkedinProfileUrl);
                            }
                            existing.setEmailVerified(true);
                            existing.setUpdatedAt(now);

                            resultUser.set(existing);
                            return objectMapper.writeValueAsBytes(users);
                        } else {
                            throw new OAuthAuthenticationException(
                                     "Cannot link account: LinkedIn email is unverified.");
                        }
                    }
                }

                // 3. New User Registration
                long nextId = 1L;
                for (User u : users) {
                    if (u.getId() != null && u.getId() >= nextId) {
                        nextId = u.getId() + 1L;
                    }
                }

                User newUser = new User(
                        linkedinId,
                        normalizedEmail,
                        firstName,
                        lastName,
                        name != null ? name : (firstName + " " + lastName).trim(),
                        pictureUrl,
                        Boolean.TRUE.equals(emailVerified),
                        linkedinProfileUrl,
                        clock
                );
                newUser.setId(nextId);
                newUser.setCreatedAt(now);
                newUser.setUpdatedAt(now);

                users.add(newUser);
                resultUser.set(newUser);
                log.info("Registered new LinkedIn user in JSON store (ID: {})", nextId);
                return objectMapper.writeValueAsBytes(users);
            });

            log.info("Successfully persisted user record in JSON store at: {} (updatedAt: {})",
                    fileStorageService.resolveReadableLocation(jsonPath), now);
            return resultUser.get();
        } catch (IOException e) {
            log.error("Failed to update user JSON store at {}: {}", jsonPath, e.getMessage(), e);
            throw new IllegalStateException("Failed to persist user to JSON storage: " + e.getMessage(), e);
        }
    }

    public synchronized Optional<User> findById(Long id) {
        if (id == null) return Optional.empty();
        return loadUsers().stream()
                .filter(u -> id.equals(u.getId()))
                .findFirst();
    }

    public synchronized Optional<User> findByLinkedinId(String linkedinId) {
        if (linkedinId == null || linkedinId.isBlank()) return Optional.empty();
        return loadUsers().stream()
                .filter(u -> linkedinId.equals(u.getLinkedinId()))
                .findFirst();
    }

    public synchronized Optional<User> findByEmail(String email) {
        if (email == null || email.isBlank()) return Optional.empty();
        String normalized = email.toLowerCase().trim();
        return loadUsers().stream()
                .filter(u -> normalized.equalsIgnoreCase(u.getEmail()))
                .findFirst();
    }

    public synchronized List<User> findAll() {
        return new ArrayList<>(loadUsers());
    }

    public String getJsonPath() {
        return jsonPath;
    }

    private List<User> loadUsers() {
        if (!fileStorageService.exists(jsonPath)) {
            return new ArrayList<>();
        }

        try {
            byte[] bytes = fileStorageService.readBytes(jsonPath);
            if (bytes == null || bytes.length == 0) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(bytes, new TypeReference<List<User>>() {});
        } catch (Exception e) {
            log.error("CRITICAL: Failed to parse user records from JSON file at {}: {}", jsonPath, e.getMessage());
            throw new IllegalStateException("Corrupted or unreadable JSON user storage file at: " + jsonPath + ". Manual inspection required.", e);
        }
    }
}
