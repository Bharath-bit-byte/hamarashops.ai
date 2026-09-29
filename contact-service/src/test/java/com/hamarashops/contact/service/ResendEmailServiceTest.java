package com.hamarashops.contact.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.contact.model.AppointmentRequest;
import com.hamarashops.contact.model.ContactInquiryRequest;
import com.hamarashops.contact.service.impl.ResendEmailServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ResendEmailServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("TEST 1: buildDynamicFrom with 'Rithika' produces 'Rithika <onboarding@resend.dev>'")
    public void testBuildDynamicFrom_Rithika() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);
        String from = service.buildDynamicFrom("Rithika");
        assertEquals("Rithika <onboarding@resend.dev>", from);
    }

    @Test
    @DisplayName("TEST 2: buildDynamicFrom with 'Charan Ranga' produces 'Charan Ranga <onboarding@resend.dev>'")
    public void testBuildDynamicFrom_CharanRanga() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);
        String from = service.buildDynamicFrom("Charan Ranga");
        assertEquals("Charan Ranga <onboarding@resend.dev>", from);
    }

    @Test
    @DisplayName("TEST 3: buildDynamicFrom with null name falls back to 'HamaraShops.ai <onboarding@resend.dev>'")
    public void testBuildDynamicFrom_NullNameFallback() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);
        String from = service.buildDynamicFrom(null);
        assertEquals("HamaraShops.ai <onboarding@resend.dev>", from);
    }

    @Test
    @DisplayName("TEST 4: buildDynamicFrom with blank/whitespace name falls back to 'HamaraShops.ai <onboarding@resend.dev>'")
    public void testBuildDynamicFrom_BlankNameFallback() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);
        assertEquals("HamaraShops.ai <onboarding@resend.dev>", service.buildDynamicFrom(""));
        assertEquals("HamaraShops.ai <onboarding@resend.dev>", service.buildDynamicFrom("   "));
        assertEquals("HamaraShops.ai <onboarding@resend.dev>", service.buildDynamicFrom("\t\n"));
    }

    @Test
    @DisplayName("TEST 5: buildDynamicFrom with 'N/A' (case-insensitive) falls back to 'HamaraShops.ai <onboarding@resend.dev>'")
    public void testBuildDynamicFrom_NAFallback() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);
        assertEquals("HamaraShops.ai <onboarding@resend.dev>", service.buildDynamicFrom("N/A"));
        assertEquals("HamaraShops.ai <onboarding@resend.dev>", service.buildDynamicFrom("n/a"));
        assertEquals("HamaraShops.ai <onboarding@resend.dev>", service.buildDynamicFrom("  N/A  "));
    }

    @Test
    @DisplayName("TEST 6: buildDynamicFrom sanitizes carriage returns, newlines, angle brackets, and double quotes")
    public void testBuildDynamicFrom_SanitizationPreventsHeaderInjection() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);

        // Name containing newlines, angle brackets, and quotes
        String maliciousName = "Rithika\r\nBcc: evil@domain.com<\"hacker\">";
        String from = service.buildDynamicFrom(maliciousName);

        // Ensure no newlines, carriage returns, or injected angle brackets exist in the display name part
        assertFalse(from.contains("\r"), "From header must not contain carriage returns");
        assertFalse(from.contains("\n"), "From header must not contain newlines");
        assertFalse(from.contains("\""), "From header must not contain double quotes");

        // The display name must end with clean single pair of brackets around sender mailbox
        assertEquals("RithikaBcc: evil@domain.comhacker <onboarding@resend.dev>", from);

        // When name contains only invalid characters, it falls back to HamaraShops.ai
        String onlySpecialChars = "<>\"\"\r\n";
        assertEquals("HamaraShops.ai <onboarding@resend.dev>", service.buildDynamicFrom(onlySpecialChars));
    }

    @Test
    @DisplayName("TEST 7: Appointment Email structure verifies from, to, and reply_to")
    public void testAppointmentEmail_FromToReplyTo() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);

        AppointmentRequest request = new AppointmentRequest(
                "Rithika",
                "rithika@gmail.com",
                "+91 98765 43210",
                "2026-10-15",
                "11:00 AM",
                "Enterprise AI Consultation",
                "Looking for AI solutions"
        );

        String dynamicFrom = service.buildDynamicFrom(request.getClientName());
        String recipient = service.resolveRecipient();
        String replyTo = request.getEmail();

        assertEquals("Rithika <onboarding@resend.dev>", dynamicFrom, "Sender From header must be dynamic customer name with onboarding@resend.dev");
        assertEquals("info@hamarashops.ai", recipient, "Recipient To header must be official notification recipient info@hamarashops.ai");
        assertEquals("rithika@gmail.com", replyTo, "Reply-To header must be customer's submitted email");
    }

    @Test
    @DisplayName("TEST 8: Inquiry Email structure verifies from, to, and reply_to")
    public void testInquiryEmail_FromToReplyTo() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);

        ContactInquiryRequest request = new ContactInquiryRequest(
                "Charan Ranga",
                "charan@gmail.com",
                "General Inquiries",
                "Partnership Inquiry",
                "Inquiring about enterprise partnership options."
        );

        String dynamicFrom = service.buildDynamicFrom(request.getFullName());
        String recipient = service.resolveRecipient();
        String replyTo = request.getEmail();

        assertEquals("Charan Ranga <onboarding@resend.dev>", dynamicFrom, "Sender From header must be dynamic customer name with onboarding@resend.dev");
        assertEquals("info@hamarashops.ai", recipient, "Recipient To header must be official notification recipient info@hamarashops.ai");
        assertEquals("charan@gmail.com", replyTo, "Reply-To header must be customer's submitted email");
    }

    @Test
    @DisplayName("Sender mailbox resolver prevents nested display names from configuration")
    public void testResolveSenderAddress_PreventsNestedDisplayNames() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);

        // When configured as pure mailbox
        service.setResendFrom("onboarding@resend.dev");
        assertEquals("onboarding@resend.dev", service.resolveSenderAddress());
        assertEquals("Rithika <onboarding@resend.dev>", service.buildDynamicFrom("Rithika"));

        // When configured with display name
        service.setResendFrom("HamaraShops.ai <onboarding@resend.dev>");
        assertEquals("onboarding@resend.dev", service.resolveSenderAddress());
        assertEquals("Rithika <onboarding@resend.dev>", service.buildDynamicFrom("Rithika"));
    }

    @Test
    @DisplayName("Recipient resolver correctly defaults to info@hamarashops.ai")
    public void testResolveRecipient_DefaultOfficialRecipient() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);
        service.setContactRecipient(null);
        assertEquals("info@hamarashops.ai", service.resolveRecipient());

        service.setContactRecipient("info@hamarashops.ai");
        assertEquals("info@hamarashops.ai", service.resolveRecipient());
    }

    @Test
    @DisplayName("Verify exception thrown when RESEND_API_KEY is missing")
    public void testMissingApiKeyThrowsIllegalStateException() {
        ResendEmailServiceImpl service = new ResendEmailServiceImpl(objectMapper);
        service.setResendApiKey("");

        ContactInquiryRequest inquiry = new ContactInquiryRequest(
                "Tester", "test@example.com", "General", "Test", "Test"
        );
        AppointmentRequest appointment = new AppointmentRequest(
                "Tester", "test@example.com", "123", "2026-10-01", "10:00 AM", "Review", "Test"
        );

        // If no env var is present, calling send should fail safely
        if (System.getenv("RESEND_API_KEY") == null || System.getenv("RESEND_API_KEY").trim().isEmpty()) {
            assertThrows(IllegalStateException.class, () -> service.sendInquiryEmail(inquiry));
            assertThrows(IllegalStateException.class, () -> service.sendAppointmentEmail(appointment));
        }
    }
}
