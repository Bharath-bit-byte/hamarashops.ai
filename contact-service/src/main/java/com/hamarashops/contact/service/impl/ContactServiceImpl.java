package com.hamarashops.contact.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.contact.exception.ResourceNotFoundException;
import com.hamarashops.contact.model.AppointmentRequest;
import com.hamarashops.contact.model.AppointmentResponse;
import com.hamarashops.contact.model.ContactInfo;
import com.hamarashops.contact.model.ContactInquiryRequest;
import com.hamarashops.contact.model.ContactInquiryResponse;
import com.hamarashops.contact.service.ContactService;
import com.hamarashops.contact.service.ResendEmailService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ContactServiceImpl implements ContactService {

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;
    private final ResendEmailService resendEmailService;

    private ContactInfo contactInfo;

    public ContactServiceImpl(ResourceLoader resourceLoader, ObjectMapper objectMapper, ResendEmailService resendEmailService) {
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
        this.resendEmailService = resendEmailService;
    }

    @PostConstruct
    public void init() {
        try {
            Resource resource = resourceLoader.getResource("classpath:data/contact-info.json");
            if (resource.exists()) {
                try (InputStream inputStream = resource.getInputStream()) {
                    this.contactInfo = objectMapper.readValue(inputStream, ContactInfo.class);
                }
            }
        } catch (Exception e) {
            this.contactInfo = new ContactInfo();
        }
    }

    @Override
    public ContactInfo getContactInfo() {
        return this.contactInfo;
    }

    @Override
    public ContactInquiryResponse submitInquiry(ContactInquiryRequest request) {
        if (request == null || request.getFullName() == null || request.getFullName().trim().isEmpty()
                || request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name and email are required for inquiry submission.");
        }

        if (request.getCategory() != null && !request.getCategory().trim().isEmpty() && contactInfo != null && contactInfo.getInquiryCategories() != null) {
            boolean validCategory = contactInfo.getInquiryCategories().stream()
                    .anyMatch(cat -> cat.equalsIgnoreCase(request.getCategory().trim()));
            if (!validCategory) {
                throw new ResourceNotFoundException("Invalid inquiry category: " + request.getCategory() + ". Approved categories: " + contactInfo.getInquiryCategories());
            }
        }

        String inquiryId = "inq-" + UUID.randomUUID().toString().substring(0, 8);
        String timestamp = LocalDateTime.now().toString();

        String resendEmailId = resendEmailService.sendInquiryEmail(request);

        if (resendEmailId == null || resendEmailId.trim().isEmpty()) {
            log.error("Contact inquiry email dispatch failed for sender: {}", request.getFullName());
            throw new IllegalStateException("Resend email service failed to accept contact inquiry email.");
        }

        log.info("Contact inquiry email successfully accepted by Resend! Resend Email ID: {}", resendEmailId);

        String receiptMessage = "Inquiry received and notification email dispatched via Resend (" + resendEmailId + ").";

        return new ContactInquiryResponse(inquiryId, "RECEIVED", timestamp, receiptMessage, resendEmailId);
    }

    private static final Logger log = LoggerFactory.getLogger(ContactServiceImpl.class);

    @Override
    public AppointmentResponse scheduleAppointment(AppointmentRequest request) {
        if (request == null || request.getClientName() == null || request.getClientName().trim().isEmpty()
                || request.getEmail() == null || request.getEmail().trim().isEmpty()
                || request.getPhone() == null || request.getPhone().trim().isEmpty()
                || request.getPreferredDate() == null || request.getPreferredDate().trim().isEmpty()
                || request.getPreferredTime() == null || request.getPreferredTime().trim().isEmpty()
                || request.getPurpose() == null || request.getPurpose().trim().isEmpty()) {
            throw new IllegalArgumentException("Client Name, Email, Phone Number, Preferred Date, Preferred Time, and Meeting Purpose are required for appointment scheduling.");
        }

        log.info("Appointment endpoint received request from client: '{}' ({}), Date: '{}', Time: '{}', Purpose: '{}'",
                request.getClientName(), request.getEmail(), request.getPreferredDate(), request.getPreferredTime(), request.getPurpose());

        String appointmentId = "apptn-" + UUID.randomUUID().toString().substring(0, 8);
        String timestamp = LocalDateTime.now().toString();

        String resendEmailId = resendEmailService.sendAppointmentEmail(request);

        if (resendEmailId == null || resendEmailId.trim().isEmpty()) {
            log.error("Appointment request email dispatch failed for client: {}", request.getClientName());
            throw new IllegalStateException("Resend email service failed to accept appointment request email.");
        }

        log.info("Appointment request email successfully accepted by Resend! Resend Email ID: {}", resendEmailId);

        String message = "Your appointment request has been submitted successfully. Our team will contact you via email or phone to confirm the schedule.";

        return new AppointmentResponse(appointmentId, "REQUESTED", timestamp, message, resendEmailId);
    }
}
