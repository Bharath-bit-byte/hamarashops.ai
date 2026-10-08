package com.hamarashops.auth.service;

import com.hamarashops.auth.model.entity.User;

public interface JwtTokenService {

    String generateToken(User user);

    String extractEmail(String token);

    Long extractUserId(String token);

    boolean validateToken(String token);

    long getExpirationMs();
}
