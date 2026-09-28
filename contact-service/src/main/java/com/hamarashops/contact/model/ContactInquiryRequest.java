package com.hamarashops.contact.model;

public class ContactInquiryRequest {
    private String fullName;
    private String email;
    private String category;
    private String subject;
    private String message;

    public ContactInquiryRequest() {}

    public ContactInquiryRequest(String fullName, String email, String category, String subject, String message) {
        this.fullName = fullName;
        this.email = email;
        this.category = category;
        this.subject = subject;
        this.message = message;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
