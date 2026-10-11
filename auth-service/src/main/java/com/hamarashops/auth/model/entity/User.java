package com.hamarashops.auth.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {

    private Long id;
    private String linkedinId;
    private String email;
    private String firstName;
    private String lastName;
    private String name;
    private String pictureUrl;
    private Boolean emailVerified = false;
    private String provider = "LINKEDIN";
    private String role = "ROLE_USER";
    private String createdAt;
    private String updatedAt;

    @JsonInclude(JsonInclude.Include.ALWAYS)
    private String linkedinProfileUrl;

    public User() {
    }

    public User(String linkedinId, String email, String firstName, String lastName, String name, String pictureUrl, Boolean emailVerified) {
        this(linkedinId, email, firstName, lastName, name, pictureUrl, emailVerified, null, null);
    }

    public User(String linkedinId, String email, String firstName, String lastName, String name, String pictureUrl, Boolean emailVerified, java.time.Clock clock) {
        this(linkedinId, email, firstName, lastName, name, pictureUrl, emailVerified, null, clock);
    }

    public User(String linkedinId, String email, String firstName, String lastName, String name, String pictureUrl, Boolean emailVerified, String linkedinProfileUrl) {
        this(linkedinId, email, firstName, lastName, name, pictureUrl, emailVerified, linkedinProfileUrl, null);
    }

    public User(String linkedinId, String email, String firstName, String lastName, String name, String pictureUrl, Boolean emailVerified, String linkedinProfileUrl, java.time.Clock clock) {
        this.linkedinId = linkedinId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.name = name;
        this.pictureUrl = pictureUrl;
        this.emailVerified = emailVerified != null ? emailVerified : false;
        this.linkedinProfileUrl = linkedinProfileUrl;
        this.provider = "LINKEDIN";
        this.role = "ROLE_USER";
        String now = (clock != null ? clock.instant() : Instant.now()).toString();
        this.createdAt = now;
        this.updatedAt = now;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getLinkedinProfileUrl() {
        return linkedinProfileUrl;
    }

    public void setLinkedinProfileUrl(String linkedinProfileUrl) {
        this.linkedinProfileUrl = linkedinProfileUrl;
    }
}
