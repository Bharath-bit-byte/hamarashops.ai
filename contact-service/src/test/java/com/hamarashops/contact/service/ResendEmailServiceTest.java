package com.hamarashops.contact.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.contact.model.ContactInquiryRequest;
import com.hamarashops.contact.service.impl.ResendEmailServiceImpl;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ResendEmailServiceTest {

    @Test
    public void testSendInquiryEmail() {
        ObjectMapper objectMapper = new ObjectMapper();
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);

        ContactInquiryRequest request = new ContactInquiryRequest(
                "HamaraShops Tester",
                "gorantlacjaran14@gmail.com",
                "General Inquiries",
                "HamaraShops Test",
                "This is a test email from HamaraShops.ai."
        );

        String apiKey = System.getenv("RESEND_API_KEY");
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            String emailId = service.sendInquiryEmail(request);
            assertNotNull(emailId, "Resend Email ID should not be null when valid RESEND_API_KEY is provided.");
            System.out.println("Resend Test Email ID: " + emailId);
        } else {
            assertThrows(IllegalStateException.class, () -> service.sendInquiryEmail(request),
                    "Should throw IllegalStateException when RESEND_API_KEY is not set.");
        }
    }

    @Test
    public void testSendAppointmentEmail() {
        ObjectMapper objectMapper = new ObjectMapper();
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);

        com.hamarashops.contact.model.AppointmentRequest request = new com.hamarashops.contact.model.AppointmentRequest(
                "Test Client",
                "test@example.com",
                "+91 98765 43210",
                "2026-09-10",
                "10:00 AM",
                "AI Architecture Review",
                "Testing appointment request email dispatch."
        );

        String apiKey = System.getenv("RESEND_API_KEY");
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            String emailId = service.sendAppointmentEmail(request);
            assertNotNull(emailId, "Resend Email ID should not be null when valid RESEND_API_KEY is provided.");
        } else {
            assertThrows(IllegalStateException.class, () -> service.sendAppointmentEmail(request),
                    "Should throw IllegalStateException when RESEND_API_KEY is not set.");
        }
    }
}
