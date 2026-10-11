package com.hamarashops.auth.dto;

public class LinkedInProfile {

    private String sub;
    private String email;
    private Boolean emailVerified;
    private String firstName;
    private String lastName;
    private String name;
    private String picture;
    private String linkedinProfileUrl;

    public LinkedInProfile() {
    }

    public LinkedInProfile(String sub, String email, Boolean emailVerified, String firstName, String lastName, String name, String picture) {
        this(sub, email, emailVerified, firstName, lastName, name, picture, null);
    }

    public LinkedInProfile(String sub, String email, Boolean emailVerified, String firstName, String lastName, String name, String picture, String linkedinProfileUrl) {
        this.sub = sub;
        this.email = email;
        this.emailVerified = emailVerified;
        this.firstName = firstName;
        this.lastName = lastName;
        this.name = name;
        this.picture = picture;
        this.linkedinProfileUrl = linkedinProfileUrl;
    }

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
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

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getLinkedinProfileUrl() {
        return linkedinProfileUrl;
    }

    public void setLinkedinProfileUrl(String linkedinProfileUrl) {
        this.linkedinProfileUrl = linkedinProfileUrl;
    }
}
