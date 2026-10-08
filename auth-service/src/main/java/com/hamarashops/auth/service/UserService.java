package com.hamarashops.auth.service;

import com.hamarashops.auth.model.entity.User;
import java.util.Optional;

public interface UserService {

    User processLinkedInUser(
            String linkedinId,
            String email,
            Boolean emailVerified,
            String firstName,
            String lastName,
            String name,
            String pictureUrl
    );

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByLinkedinId(String linkedinId);
}
