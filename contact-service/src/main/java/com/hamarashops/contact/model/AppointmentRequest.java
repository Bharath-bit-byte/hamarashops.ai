package com.hamarashops.contact.model;

public class AppointmentRequest {
    private String clientName;
    private String email;
    private String phone;
    private String preferredDate;
    private String preferredTime;
    private String purpose;
    private String message;

    public AppointmentRequest() {
    }

    public AppointmentRequest(String clientName, String email, String phone, String preferredDate, String preferredTime, String purpose, String message) {
        this.clientName = clientName;
        this.email = email;
        this.phone = phone;
        this.preferredDate = preferredDate;
        this.preferredTime = preferredTime;
        this.purpose = purpose;
        this.message = message;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(String preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
