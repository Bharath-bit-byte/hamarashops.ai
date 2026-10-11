package com.hamarashops.auth.serviceimpl;

import com.hamarashops.auth.model.entity.User;
import com.hamarashops.auth.service.UserService;
import com.hamarashops.auth.storage.ExcelUserStorageService;
import com.hamarashops.auth.storage.JsonUserStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final JsonUserStorageService jsonUserStorageService;
    private final ExcelUserStorageService excelUserStorageService;

    public UserServiceImpl(
            JsonUserStorageService jsonUserStorageService,
            ExcelUserStorageService excelUserStorageService) {
        this.jsonUserStorageService = jsonUserStorageService;
        this.excelUserStorageService = excelUserStorageService;
    }

    @Override
    public User processLinkedInUser(
            String linkedinId,
            String email,
            Boolean emailVerified,
            String firstName,
            String lastName,
            String name,
            String pictureUrl) {
        User user = jsonUserStorageService.upsertUser(
                linkedinId,
                email,
                emailVerified,
                firstName,
                lastName,
                name,
                pictureUrl
        );

        try {
            excelUserStorageService.syncUserToExcel(user);
        } catch (Exception e) {
            log.error("Failed to sync user [{}] to Excel workbook, but JSON persistence succeeded: {}", user.getLinkedinId(), e.getMessage());
        }

        return user;
    }

    @Override
    public User processLinkedInUser(
            String linkedinId,
            String email,
            Boolean emailVerified,
            String firstName,
            String lastName,
            String name,
            String pictureUrl,
            String linkedinProfileUrl) {

        // 1. Upsert user in JSON storage
        User user = jsonUserStorageService.upsertUser(
                linkedinId,
                email,
                emailVerified,
                firstName,
                lastName,
                name,
                pictureUrl,
                linkedinProfileUrl
        );

        // 2. Synchronize user to existing Excel workbook
        try {
            excelUserStorageService.syncUserToExcel(user);
        } catch (Exception e) {
            log.error("Failed to sync user [{}] to Excel workbook, but JSON persistence succeeded: {}", user.getLinkedinId(), e.getMessage());
            // Do not fail user login if Excel write encounters an issue, or rethrow if strict
        }

        return user;
    }

    @Override
    public Optional<User> findById(Long id) {
        return jsonUserStorageService.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jsonUserStorageService.findByEmail(email);
    }

    @Override
    public Optional<User> findByLinkedinId(String linkedinId) {
        return jsonUserStorageService.findByLinkedinId(linkedinId);
    }
}
