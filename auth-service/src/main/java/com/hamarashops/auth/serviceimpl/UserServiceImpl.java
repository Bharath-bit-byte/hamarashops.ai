package com.hamarashops.auth.serviceimpl;

import com.hamarashops.auth.exception.OAuthAuthenticationException;
import com.hamarashops.auth.model.entity.User;
import com.hamarashops.auth.repository.UserRepository;
import com.hamarashops.auth.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public User processLinkedInUser(
            String linkedinId,
            String email,
            Boolean emailVerified,
            String firstName,
            String lastName,
            String name,
            String pictureUrl) {

        if (linkedinId == null || linkedinId.trim().isEmpty()) {
            throw new OAuthAuthenticationException("Missing LinkedIn subject identifier (sub).");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new OAuthAuthenticationException("Missing email address in LinkedIn profile claims.");
        }

        // 1. Look for existing user with this LinkedIn ID
        Optional<User> existingByLinkedinId = userRepository.findByLinkedinId(linkedinId);
        if (existingByLinkedinId.isPresent()) {
            User user = existingByLinkedinId.get();
            // Update profile fields if updated on LinkedIn
            if (name != null) user.setName(name);
            if (firstName != null) user.setFirstName(firstName);
            if (lastName != null) user.setLastName(lastName);
            if (pictureUrl != null) user.setPictureUrl(pictureUrl);
            if (emailVerified != null) user.setEmailVerified(emailVerified);
            return userRepository.save(user);
        }

        // 2. Look for existing user with same email (Account Linking)
        Optional<User> existingByEmail = userRepository.findByEmail(email.toLowerCase().trim());
        if (existingByEmail.isPresent()) {
            User user = existingByEmail.get();
            // Only link if LinkedIn guarantees email is verified
            if (Boolean.TRUE.equals(emailVerified)) {
                user.setLinkedinId(linkedinId);
                if (pictureUrl != null && user.getPictureUrl() == null) {
                    user.setPictureUrl(pictureUrl);
                }
                user.setEmailVerified(true);
                return userRepository.save(user);
            } else {
                throw new OAuthAuthenticationException(
                        "Cannot link account: LinkedIn email is unverified for address " + email);
            }
        }

        // 3. New user registration
        User newUser = new User(
                linkedinId,
                email.toLowerCase().trim(),
                firstName,
                lastName,
                name != null ? name : (firstName + " " + lastName).trim(),
                pictureUrl,
                Boolean.TRUE.equals(emailVerified)
        );
        return userRepository.save(newUser);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByLinkedinId(String linkedinId) {
        return userRepository.findByLinkedinId(linkedinId);
    }
}
