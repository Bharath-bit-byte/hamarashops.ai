package com.hamarashops.contact.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.contact.model.AppointmentRequest;
import com.hamarashops.contact.model.ContactInquiryRequest;
import com.hamarashops.contact.service.ResendEmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResendEmailServiceImpl implements ResendEmailService {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailServiceImpl.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Value("${RESEND_API_KEY:${resend.api.key:}}")
    private String resendApiKey;

    @Value("${NOTIFICATION_TO_EMAIL:${CONTACT_RECIPIENT:${contact.recipient:info@hamarashops.ai}}}")
    private String contactRecipient;

    @Value("${CONTACT_FROM_EMAIL:${RESEND_FROM:${resend.from:onboarding@resend.dev}}}")
    private String resendFrom;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public ResendEmailServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String resolveSenderAddress() {
        String from = (resendFrom != null && !resendFrom.trim().isEmpty())
                ? resendFrom.trim()
                : (System.getenv("CONTACT_FROM_EMAIL") != null
                    ? System.getenv("CONTACT_FROM_EMAIL").trim()
                    : (System.getenv("RESEND_FROM") != null ? System.getenv("RESEND_FROM").trim() : "onboarding@resend.dev"));

        if (from == null || from.trim().isEmpty()) {
            return "onboarding@resend.dev";
        }

        // If from contains display name e.g. "HamaraShops.ai <onboarding@resend.dev>", extract pure email inside brackets
        if (from.contains("<") && from.contains(">")) {
            int start = from.lastIndexOf("<");
            int end = from.indexOf(">", start);
            if (end > start) {
                String extracted = from.substring(start + 1, end).trim();
                if (!extracted.isEmpty()) {
                    return extracted;
                }
            }
        }

        String cleaned = from.replaceAll("[<>]", "").trim();
        return cleaned.isEmpty() ? "onboarding@resend.dev" : cleaned;
    }

    public String buildDynamicFrom(String customerName) {
        String senderEmail = resolveSenderAddress();

        if (customerName == null || customerName.trim().isEmpty() || "N/A".equalsIgnoreCase(customerName.trim())) {
            return "HamaraShops.ai <" + senderEmail + ">";
        }

        // Sanitize customer name: remove angle brackets, quotes, newlines, carriage returns
        String cleanName = customerName.replaceAll("[\\r\\n<>\"]", "").trim();
        if (cleanName.isEmpty()) {
            return "HamaraShops.ai <" + senderEmail + ">";
        }

        return cleanName + " <" + senderEmail + ">";
    }

    public String resolveRecipient() {
        if (contactRecipient != null && !contactRecipient.trim().isEmpty()) {
            return contactRecipient.trim();
        }
        String envNotif = System.getenv("NOTIFICATION_TO_EMAIL");
        if (envNotif != null && !envNotif.trim().isEmpty()) {
            return envNotif.trim();
        }
        String envContact = System.getenv("CONTACT_RECIPIENT");
        if (envContact != null && !envContact.trim().isEmpty()) {
            return envContact.trim();
        }
        return "info@hamarashops.ai";
    }

    public void setResendApiKey(String resendApiKey) {
        this.resendApiKey = resendApiKey;
    }

    public void setContactRecipient(String contactRecipient) {
        this.contactRecipient = contactRecipient;
    }

    public void setResendFrom(String resendFrom) {
        this.resendFrom = resendFrom;
    }

    @Override
    public String sendInquiryEmail(ContactInquiryRequest request) {
        String fullName = (request != null && request.getFullName() != null) ? request.getFullName().trim() : "N/A";
        String senderEmail = (request != null && request.getEmail() != null) ? request.getEmail().trim() : "N/A";
        String category = (request != null && request.getCategory() != null) ? request.getCategory().trim() : "N/A";

        log.info("Invoking sendInquiryEmail for sender: '{}' ({}), category: '{}'", fullName, senderEmail, category);

        String apiKey = (resendApiKey != null && !resendApiKey.trim().isEmpty())
                ? resendApiKey.trim()
                : System.getenv("RESEND_API_KEY");

        String recipient = resolveRecipient();
        String from = buildDynamicFrom(fullName);

        boolean apiKeyPresent = (apiKey != null && !apiKey.trim().isEmpty());
        boolean fromPresent = (from != null && !from.trim().isEmpty());
        boolean recipientPresent = (recipient != null && !recipient.trim().isEmpty());

        log.info("Environment Diagnostic Check -> RESEND_API_KEY present: {}, FROM: '{}', TO: '{}', REPLY_TO: '{}'",
                apiKeyPresent, from, recipient, senderEmail);

        if (!apiKeyPresent) {
            log.error("RESEND_API_KEY environment variable is not configured. Cannot dispatch Resend email for inquiry.");
            throw new IllegalStateException("RESEND_API_KEY environment variable is not configured on the backend server. Please configure RESEND_API_KEY in contact-service.");
        }

        String subject = (request != null && request.getSubject() != null && !request.getSubject().trim().isEmpty())
                ? request.getSubject().trim()
                : "New Contact Inquiry — HamaraShops.ai";

        String messageText = (request != null && request.getMessage() != null && !request.getMessage().trim().isEmpty())
                ? request.getMessage().trim()
                : "This is a contact inquiry from HamaraShops.ai.";

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("from", from);
            payload.put("to", Collections.singletonList(recipient));
            if (senderEmail != null && !senderEmail.trim().isEmpty() && !"N/A".equalsIgnoreCase(senderEmail)) {
                payload.put("reply_to", senderEmail.trim());
            }
            payload.put("subject", subject);
            payload.put("text", messageText);
            
            String htmlContent = "<div style=\"font-family: Arial, sans-serif; padding: 20px; color: #1a1c20;\">"
                    + "<h2 style=\"color: #0a1628;\">HamaraShops.ai Inquiry Notification</h2>"
                    + "<p style=\"color: #555;\">" + messageText + "</p>"
                    + "<hr style=\"border: 1px solid #eee; margin: 15px 0;\"/>"
                    + "<p><b>Full Name:</b> " + fullName + "</p>"
                    + "<p><b>Sender Email:</b> " + senderEmail + "</p>"
                    + "<p><b>Category:</b> " + category + "</p>"
                    + "<p><b>Subject:</b> " + subject + "</p>"
                    + "</div>";
            payload.put("html", htmlContent);

            String jsonPayload = objectMapper.writeValueAsString(payload);

            log.info("Attempting Resend API HTTP POST to https://api.resend.com/emails for recipient: {} from: {} with subject: '{}'", recipient, from, subject);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            log.info("Resend API HTTP status for inquiry: {}", httpResponse.statusCode());
            log.info("Resend API HTTP response payload: {}", httpResponse.body());

            if (httpResponse.statusCode() >= 200 && httpResponse.statusCode() < 300) {
                Map<?, ?> responseMap = objectMapper.readValue(httpResponse.body(), Map.class);
                Object emailIdObj = responseMap.get("id");
                if (emailIdObj != null) {
                    String emailId = emailIdObj.toString();
                    log.info("Resend inquiry email request accepted successfully! Resend Email ID: {}", emailId);
                    return emailId;
                } else {
                    log.error("Resend API returned status 200/201 but no 'id' field in body: {}", httpResponse.body());
                    throw new IllegalStateException("Resend API accepted inquiry request but returned no Email ID.");
                }
            } else {
                log.error("Resend API error status for inquiry: {}, body: {}", httpResponse.statusCode(), httpResponse.body());
                throw new IllegalStateException("Resend API returned error status " + httpResponse.statusCode() + ": " + httpResponse.body());
            }
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("Exception during Resend inquiry email dispatch: {}", e.getMessage(), e);
            throw new IllegalStateException("Failed to communicate with Resend API: " + e.getMessage(), e);
        }
    }

    @Override
    public String sendAppointmentEmail(AppointmentRequest request) {
        String clientName = (request != null && request.getClientName() != null) ? request.getClientName().trim() : "N/A";
        String email = (request != null && request.getEmail() != null) ? request.getEmail().trim() : "N/A";
        String phone = (request != null && request.getPhone() != null) ? request.getPhone().trim() : "N/A";
        String preferredDate = (request != null && request.getPreferredDate() != null) ? request.getPreferredDate().trim() : "N/A";
        String preferredTime = (request != null && request.getPreferredTime() != null) ? request.getPreferredTime().trim() : "N/A";
        String purpose = (request != null && request.getPurpose() != null) ? request.getPurpose().trim() : "N/A";
        String message = (request != null && request.getMessage() != null && !request.getMessage().trim().isEmpty()) ? request.getMessage().trim() : "None";

        log.info("Invoking sendAppointmentEmail for client: '{}', email: '{}', date: '{}', time: '{}'", clientName, email, preferredDate, preferredTime);

        String apiKey = (resendApiKey != null && !resendApiKey.trim().isEmpty())
                ? resendApiKey.trim()
                : System.getenv("RESEND_API_KEY");

        String recipient = resolveRecipient();
        String from = buildDynamicFrom(clientName);

        boolean apiKeyPresent = (apiKey != null && !apiKey.trim().isEmpty());
        boolean fromPresent = (from != null && !from.trim().isEmpty());
        boolean recipientPresent = (recipient != null && !recipient.trim().isEmpty());

        log.info("Environment Diagnostic Check -> RESEND_API_KEY present: {}, FROM: '{}', TO: '{}', REPLY_TO: '{}'",
                apiKeyPresent, from, recipient, email);

        if (!apiKeyPresent) {
            log.error("RESEND_API_KEY environment variable is not configured. Cannot dispatch Resend email for appointment.");
            throw new IllegalStateException("RESEND_API_KEY environment variable is not configured on the backend server. Please configure RESEND_API_KEY in contact-service.");
        }

        String subject = "New Appointment Request — HamaraShops.ai";

        String plainText = "New Appointment Request — HamaraShops.ai\n\n"
                + "Client Name: " + clientName + "\n"
                + "Email: " + email + "\n"
                + "Phone: " + phone + "\n"
                + "Preferred Date: " + preferredDate + "\n"
                + "Preferred Time: " + preferredTime + "\n"
                + "Meeting Purpose: " + purpose + "\n"
                + "Additional Message: " + message + "\n";

        String htmlContent = "<div style=\"font-family: Arial, sans-serif; padding: 20px; color: #1a1c20;\">"
                + "<h2 style=\"color: #0a1628;\">New Appointment Request — HamaraShops.ai</h2>"
                + "<p style=\"color: #555;\">A client has submitted a meeting appointment request.</p>"
                + "<hr style=\"border: 1px solid #eee; margin: 15px 0;\"/>"
                + "<p><b>Client Name:</b> " + clientName + "</p>"
                + "<p><b>Email:</b> " + email + "</p>"
                + "<p><b>Phone:</b> " + phone + "</p>"
                + "<p><b>Preferred Date:</b> " + preferredDate + "</p>"
                + "<p><b>Preferred Time:</b> " + preferredTime + "</p>"
                + "<p><b>Meeting Purpose:</b> " + purpose + "</p>"
                + "<p><b>Additional Message:</b> " + message + "</p>"
                + "<hr style=\"border: 1px solid #eee; margin: 15px 0;\"/>"
                + "<p style=\"font-size: 12px; color: #888;\">Please review and confirm this appointment request with the client directly.</p>"
                + "</div>";

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("from", from);
            payload.put("to", Collections.singletonList(recipient));
            if (email != null && !email.trim().isEmpty() && !"N/A".equalsIgnoreCase(email)) {
                payload.put("reply_to", email.trim());
            }
            payload.put("subject", subject);
            payload.put("text", plainText);
            payload.put("html", htmlContent);

            String jsonPayload = objectMapper.writeValueAsString(payload);

            log.info("Attempting Resend API HTTP POST to https://api.resend.com/emails for recipient: {} from: {} with subject: '{}'", recipient, from, subject);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            log.info("Resend API HTTP status for appointment: {}", httpResponse.statusCode());
            log.info("Resend API HTTP response payload: {}", httpResponse.body());

            if (httpResponse.statusCode() >= 200 && httpResponse.statusCode() < 300) {
                Map<?, ?> responseMap = objectMapper.readValue(httpResponse.body(), Map.class);
                Object emailIdObj = responseMap.get("id");
                if (emailIdObj != null) {
                    String emailId = emailIdObj.toString();
                    log.info("Resend email request accepted successfully! Resend Email ID: {}", emailId);
                    return emailId;
                } else {
                    log.error("Resend API returned status 200/201 but no 'id' field in body: {}", httpResponse.body());
                    throw new IllegalStateException("Resend API accepted request but returned no Email ID.");
                }
            } else {
                log.error("Resend API error status for appointment: {}, body: {}", httpResponse.statusCode(), httpResponse.body());
                throw new IllegalStateException("Resend API returned error status " + httpResponse.statusCode() + ": " + httpResponse.body());
            }
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("Exception during Resend appointment email dispatch: {}", e.getMessage(), e);
            throw new IllegalStateException("Failed to communicate with Resend API: " + e.getMessage(), e);
        }
    }
}
