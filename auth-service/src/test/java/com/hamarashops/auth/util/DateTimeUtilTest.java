package com.hamarashops.auth.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

public class DateTimeUtilTest {

    @Test
    @DisplayName("UTC morning instant converts to expected AM IST string")
    public void testUtcToIstConversionMorning() {
        // 2026-10-10 05:35:58 UTC + 05:30 -> 2026-10-10 11:05:58 AM IST
        String utcString = "2026-10-10T05:35:58Z";
        String istString = DateTimeUtil.formatToIst(utcString);

        assertNotNull(istString);
        assertEquals("2026-10-10 11:05:58 AM IST", istString);
    }

    @Test
    @DisplayName("UTC afternoon instant converts to expected PM IST string")
    public void testUtcToIstConversionAfternoon() {
        // 2026-10-10 10:39:53 UTC + 05:30 -> 2026-10-10 04:09:53 PM IST
        String utcString = "2026-10-10T10:39:53.933229Z";
        String istString = DateTimeUtil.formatToIst(utcString);

        assertNotNull(istString);
        assertEquals("2026-10-10 04:09:53 PM IST", istString);
    }

    @Test
    @DisplayName("Idempotency: already converted IST string is not double converted")
    public void testIdempotentConversion() {
        String alreadyIst = "2026-10-10 11:05:58 AM IST";
        String result = DateTimeUtil.formatToIst(alreadyIst);

        assertEquals(alreadyIst, result, "Should not alter string already ending in IST");
    }

    @Test
    @DisplayName("Parse IST back to Instant matches the original UTC Instant (to the second)")
    public void testParseIstToInstant() {
        Instant original = Instant.parse("2026-10-10T05:35:58Z");
        String formatted = DateTimeUtil.formatToIst(original);
        assertEquals("2026-10-10 11:05:58 AM IST", formatted);

        Instant parsed = DateTimeUtil.parseIstToInstant(formatted);
        assertNotNull(parsed);
        assertEquals(original.truncatedTo(ChronoUnit.SECONDS), parsed.truncatedTo(ChronoUnit.SECONDS));
    }

    @Test
    @DisplayName("Null and blank handling")
    public void testNullAndBlank() {
        assertNull(DateTimeUtil.formatToIst((String) null));
        assertNull(DateTimeUtil.formatToIst((Instant) null));
        assertNull(DateTimeUtil.formatToIst("   "));
        assertNull(DateTimeUtil.parseIstToInstant(null));
    }
}
