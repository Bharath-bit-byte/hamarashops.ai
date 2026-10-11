package com.hamarashops.auth.dto;

import com.hamarashops.auth.model.entity.User;

public class UserResponse {

    private Long id;
    private String linkedinId;
    private String name;
    private String firstName;
    private String lastName;
    private String email;
    private String pictureUrl;
    private Boolean emailVerified;
    private String provider;
    private String role;
    private String createdAt;
    private String updatedAt;
    private String createdAtIst;
    private String updatedAtIst;
    private String linkedinProfileUrl;

    public UserResponse() {
    }

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setLinkedinId(user.getLinkedinId());
        response.setName(user.getName());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPictureUrl(user.getPictureUrl());
        response.setEmailVerified(user.getEmailVerified());
        response.setLinkedinProfileUrl(user.getLinkedinProfileUrl());
        response.setProvider(user.getProvider());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        response.setCreatedAtIst(formatUtcToIst(user.getCreatedAt()));
        response.setUpdatedAtIst(formatUtcToIst(user.getUpdatedAt()));
        return response;
    }

    /**
     * Converts an ISO-8601 UTC timestamp string to India Standard Time (IST, UTC+05:30) for display.
     */
    public static String formatUtcToIst(String utcIsoString) {
        return com.hamarashops.auth.util.DateTimeUtil.formatToIst(utcIsoString);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLinkedinId() {
        return linkedinId;
    }

    public void setLinkedinId(String linkedinId) {
        this.linkedinId = linkedinId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedAtIst() {
        return createdAtIst;
    }

    public void setCreatedAtIst(String createdAtIst) {
        this.createdAtIst = createdAtIst;
    }

    public String getUpdatedAtIst() {
        return updatedAtIst;
    }

    public void setUpdatedAtIst(String updatedAtIst) {
        this.updatedAtIst = updatedAtIst;
    }

    public String getLinkedinProfileUrl() {
        return linkedinProfileUrl;
    }

    public void setLinkedinProfileUrl(String linkedinProfileUrl) {
        this.linkedinProfileUrl = linkedinProfileUrl;
    }
}
