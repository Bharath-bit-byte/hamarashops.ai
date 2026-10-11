package com.hamarashops.auth.storage;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.auth.exception.OAuthAuthenticationException;
import com.hamarashops.auth.model.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

public class JsonUserStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalFileStorageService fileStorageService;
    private JsonUserStorageService jsonUserStorageService;
    private String testJsonPath;

    @BeforeEach
    public void setUp() {
        fileStorageService = new LocalFileStorageService();
        testJsonPath = tempDir.resolve("users.json").toString();
        jsonUserStorageService = new JsonUserStorageService(
                fileStorageService,
                testJsonPath,
                "auth/users.json",
                "LOCAL"
        );
    }

    @Test
    @DisplayName("First-time login creates a new JSON user record with timestamps and ID")
    public void testFirstTimeLoginCreatesRecord() throws IOException {
        User user = jsonUserStorageService.upsertUser(
                "urn:li:person:new_member_1",
                "member1@example.com",
                true,
                "Alice",
                "Smith",
                "Alice Smith",
                "https://example.com/alice.jpg"
        );

        assertNotNull(user);
        assertEquals("urn:li:person:new_member_1", user.getLinkedinId());
        assertEquals("member1@example.com", user.getEmail());
        assertEquals("Alice Smith", user.getName());
        assertEquals(1L, user.getId());
        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());

        // Verify persisted content in file
        byte[] bytes = fileStorageService.readBytes(testJsonPath);
        ObjectMapper mapper = new ObjectMapper();
        List<User> list = mapper.readValue(bytes, new TypeReference<>() {});
        assertEquals(1, list.size());
        assertEquals("urn:li:person:new_member_1", list.get(0).getLinkedinId());
    }

    @Test
    @DisplayName("Repeat login updates existing user without duplicate and preserves createdAt")
    public void testRepeatLoginUpdatesExistingRecord() {
        // 1. Initial Login
        User user1 = jsonUserStorageService.upsertUser(
                "urn:li:person:repeat_member",
                "repeat@example.com",
                true,
                "Initial",
                "Name",
                "Initial Name",
                "https://example.com/pic1.jpg"
        );
        String initialCreatedAt = user1.getCreatedAt();
        String initialUpdatedAt = user1.getUpdatedAt();
        Long initialId = user1.getId();

        // 2. Wait briefly to ensure timestamp advances
        try {
            Thread.sleep(20);
        } catch (InterruptedException ignored) {}

        // 3. Repeat Login with updated name and picture
        User user2 = jsonUserStorageService.upsertUser(
                "urn:li:person:repeat_member",
                "repeat@example.com",
                true,
                "Updated",
                "Name",
                "Updated Name",
                "https://example.com/pic2.jpg"
        );

        assertEquals(initialId, user2.getId(), "User ID must be preserved");
        assertEquals(initialCreatedAt, user2.getCreatedAt(), "createdAt timestamp must be preserved");
        assertNotEquals(initialUpdatedAt, user2.getUpdatedAt(), "updatedAt must advance on repeated login");
        assertTrue(
                java.time.Instant.parse(user2.getUpdatedAt()).isAfter(java.time.Instant.parse(initialUpdatedAt)),
                "updatedAt must be after initial updatedAt"
        );
        assertEquals("Updated Name", user2.getName());
        assertEquals("https://example.com/pic2.jpg", user2.getPictureUrl());

        // Verify total records in JSON remains exactly 1
        List<User> all = jsonUserStorageService.findAll();
        assertEquals(1, all.size(), "No duplicate record should be created for same LinkedIn member");
    }

    @Test
    @DisplayName("Account linking succeeds when verified email matches existing account")
    public void testAccountLinkingWithVerifiedEmail() {
        // Existing user registered under another provider or email
        jsonUserStorageService.upsertUser(
                "legacy_provider_id",
                "linkme@example.com",
                true,
                "Link",
                "User",
                "Link User",
                null
        );

        // LinkedIn sign-in with matching verified email
        User linked = jsonUserStorageService.upsertUser(
                "urn:li:person:linked_123",
                "linkme@example.com",
                true,
                "Link",
                "User",
                "Link User",
                "https://example.com/avatar.jpg"
        );

        assertEquals("urn:li:person:linked_123", linked.getLinkedinId());
        assertEquals(1, jsonUserStorageService.findAll().size());
    }

    @Test
    @DisplayName("Account linking fails when email is unverified on LinkedIn")
    public void testAccountLinkingFailsForUnverifiedEmail() {
        jsonUserStorageService.upsertUser(
                "first_id",
                "secure@example.com",
                true,
                "Secure",
                "User",
                "Secure User",
                null
        );

        assertThrows(OAuthAuthenticationException.class, () -> {
            jsonUserStorageService.upsertUser(
                    "attacker_li_id",
                    "secure@example.com",
                    false, // unverified!
                    "Attacker",
                    "User",
                    "Attacker User",
                    null
            );
        });
    }

    @Test
    @DisplayName("Handles missing optional claims gracefully")
    public void testMissingOptionalClaims() {
        User user = jsonUserStorageService.upsertUser(
                "urn:li:person:minimal",
                "minimal@example.com",
                null,
                null,
                null,
                null,
                null
        );

        assertNotNull(user);
        assertEquals("urn:li:person:minimal", user.getLinkedinId());
        assertEquals("minimal@example.com", user.getEmail());
        assertFalse(user.getEmailVerified());
    }

    @Test
    @DisplayName("Corrupted JSON file throws IllegalStateException and does not overwrite corrupted data")
    public void testCorruptedJsonThrowsAndDoesNotOverwrite() throws IOException {
        Path path = Path.of(testJsonPath);
        Files.writeString(path, "{ corrupted malformed non-array json !!!");

        assertThrows(IllegalStateException.class, () -> {
            jsonUserStorageService.upsertUser(
                    "urn:li:person:fail",
                    "fail@example.com",
                    true,
                    "Fail",
                    "User",
                    "Fail User",
                    null
            );
        });

        // Ensure the corrupted file content was NOT overwritten with an empty array
        String remainingContent = Files.readString(path);
        assertTrue(remainingContent.contains("corrupted malformed"), "Corrupted file content must be preserved for inspection");
    }

    @Test
    @DisplayName("Concurrent user upserts safely persist all records without race condition loss")
    public void testConcurrentUpserts() throws InterruptedException {
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch latch = new CountDownLatch(threads);

        for (int i = 0; i < threads; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    jsonUserStorageService.upsertUser(
                            "urn:li:person:thread_" + index,
                            "thread_" + index + "@example.com",
                            true,
                            "User",
                            String.valueOf(index),
                            "User " + index,
                            null
                    );
                } finally {
                    latch.countDown();
                }
            });
        }

        assertTrue(latch.await(10, TimeUnit.SECONDS));
        executor.shutdown();

        List<User> all = jsonUserStorageService.findAll();
        assertEquals(threads, all.size(), "All concurrent user registrations must be saved safely");
    }

    @Test
    @DisplayName("Deterministic Clock test: verify updatedAt advances on subsequent login, createdAt remains unchanged, and no duplicate is created")
    public void testDeterministicClockAdvancesUpdatedAtPreservesCreatedAtAndNoDuplicates() {
        java.time.Instant t1 = java.time.Instant.parse("2026-10-10T10:00:00Z");
        java.time.Instant t2 = java.time.Instant.parse("2026-10-10T11:30:00Z");

        java.time.Clock fixedClockT1 = java.time.Clock.fixed(t1, java.time.ZoneOffset.UTC);
        String customPath = tempDir.resolve("clock-users.json").toString();
        JsonUserStorageService storage = new JsonUserStorageService(
                fileStorageService,
                customPath,
                "auth/clock-users.json",
                "LOCAL",
                fixedClockT1
        );

        // 1. Initial Login at T1
        User user1 = storage.upsertUser(
                "CAJWu6KJua",
                "test@example.com",
                true,
                "Gorantla",
                "Charan Ranga",
                "Gorantla Charan Ranga",
                "https://example.com/avatar.jpg"
        );

        assertNotNull(user1);
        assertEquals(t1.toString(), user1.getCreatedAt(), "createdAt must match T1 UTC instant");
        assertEquals(t1.toString(), user1.getUpdatedAt(), "updatedAt must match T1 UTC instant on initial login");

        // 2. Subsequent Login at T2 using new Clock
        java.time.Clock fixedClockT2 = java.time.Clock.fixed(t2, java.time.ZoneOffset.UTC);
        JsonUserStorageService storageT2 = new JsonUserStorageService(
                fileStorageService,
                customPath,
                "auth/clock-users.json",
                "LOCAL",
                fixedClockT2
        );

        User user2 = storageT2.upsertUser(
                "CAJWu6KJua",
                "test@example.com",
                true,
                "Gorantla",
                "Charan Ranga",
                "Gorantla Charan Ranga",
                "https://example.com/avatar-new.jpg"
        );

        assertNotNull(user2);
        assertEquals("CAJWu6KJua", user2.getLinkedinId());
        assertEquals(t1.toString(), user2.getCreatedAt(), "createdAt must be strictly preserved across subsequent logins");
        assertEquals(t2.toString(), user2.getUpdatedAt(), "updatedAt must advance to the new T2 UTC instant");
        assertTrue(
                java.time.Instant.parse(user2.getUpdatedAt()).isAfter(java.time.Instant.parse(user2.getCreatedAt())),
                "updatedAt must be after createdAt"
        );

        // Verify storage has no duplicates
        List<User> list = storageT2.findAll();
        assertEquals(1, list.size(), "Only 1 user record should exist with no duplicate LinkedIn ID");

        // Verify UserResponse mapping and IST formatting
        com.hamarashops.auth.dto.UserResponse dto = com.hamarashops.auth.dto.UserResponse.fromEntity(user2);
        assertEquals(t1.toString(), dto.getCreatedAt());
        assertEquals(t2.toString(), dto.getUpdatedAt());
        assertNotNull(dto.getCreatedAtIst());
        assertNotNull(dto.getUpdatedAtIst());
        // 10:00:00 UTC -> 03:30:00 PM IST (UTC + 05:30)
        assertEquals("2026-10-10 03:30:00 PM IST", dto.getCreatedAtIst());
        // 11:30:00 UTC -> 05:00:00 PM IST (UTC + 05:30)
        assertEquals("2026-10-10 05:00:00 PM IST", dto.getUpdatedAtIst());
    }

    @Test
    @DisplayName("Upsert with linkedinProfileUrl persists URL to JSON and maps to UserResponse")
    public void testUpsertWithLinkedinProfileUrl() throws IOException {
        String profileUrl = "https://www.linkedin.com/in/charan-ranga";
        User user = jsonUserStorageService.upsertUser(
                "li_url_test",
                "testurl@example.com",
                true,
                "Charan",
                "Ranga",
                "Charan Ranga",
                "https://example.com/pic.jpg",
                profileUrl
        );

        assertNotNull(user);
        assertEquals(profileUrl, user.getLinkedinProfileUrl());

        // Verify JSON on disk contains "linkedinProfileUrl": "https://www.linkedin.com/in/charan-ranga"
        byte[] bytes = fileStorageService.readBytes(testJsonPath);
        String jsonContent = new String(bytes, java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(jsonContent.contains("\"linkedinProfileUrl\" : \"" + profileUrl + "\"") ||
                   jsonContent.contains("\"linkedinProfileUrl\":\"" + profileUrl + "\""));

        com.hamarashops.auth.dto.UserResponse response = com.hamarashops.auth.dto.UserResponse.fromEntity(user);
        assertEquals(profileUrl, response.getLinkedinProfileUrl());
    }

    @Test
    @DisplayName("Upsert with null linkedinProfileUrl serializes null and maps to UserResponse as null")
    public void testUpsertWithNullLinkedinProfileUrl() throws IOException {
        User user = jsonUserStorageService.upsertUser(
                "li_null_url",
                "testnull@example.com",
                true,
                "Null",
                "User",
                "Null User",
                null,
                null
        );

        assertNotNull(user);
        assertNull(user.getLinkedinProfileUrl());

        // Verify JSON on disk explicitly contains "linkedinProfileUrl" : null
        byte[] bytes = fileStorageService.readBytes(testJsonPath);
        String jsonContent = new String(bytes, java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(jsonContent.contains("\"linkedinProfileUrl\" : null") ||
                   jsonContent.contains("\"linkedinProfileUrl\":null"));

        com.hamarashops.auth.dto.UserResponse response = com.hamarashops.auth.dto.UserResponse.fromEntity(user);
        assertNull(response.getLinkedinProfileUrl());
    }
}
