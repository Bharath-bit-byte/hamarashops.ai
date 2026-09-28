package com.hamarashops.contact.model;

public class AppointmentResponse {
    private String appointmentId;
    private String status;
    private String timestamp;
    private String message;
    private String resendEmailId;

    public AppointmentResponse() {
    }

    public AppointmentResponse(String appointmentId, String status, String timestamp, String message, String resendEmailId) {
        this.appointmentId = appointmentId;
        this.status = status;
        this.timestamp = timestamp;
        this.message = message;
        this.resendEmailId = resendEmailId;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResendEmailId() {
        return resendEmailId;
    }

    public void setResendEmailId(String resendEmailId) {
        this.resendEmailId = resendEmailId;
    }
}
