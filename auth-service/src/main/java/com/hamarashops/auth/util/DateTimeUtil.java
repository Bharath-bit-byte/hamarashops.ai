package com.hamarashops.auth.util;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

/**
 * Utility for date/time conversion between UTC ISO-8601 storage format
 * and India Standard Time (IST, Asia/Kolkata, UTC+05:30) display format.
 */
public final class DateTimeUtil {

    public static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");
    public static final String IST_PATTERN = "yyyy-MM-dd hh:mm:ss a 'IST'";
    public static final DateTimeFormatter IST_FORMATTER = DateTimeFormatter
            .ofPattern(IST_PATTERN, Locale.ENGLISH)
            .withZone(IST_ZONE);

    private DateTimeUtil() {
    }

    /**
     * Converts a UTC ISO-8601 timestamp string (e.g., "2026-10-10T05:35:58.123Z")
     * into India Standard Time (IST) formatted string:
     * "2026-10-10 11:05:58 AM IST".
     *
     * If the string is already formatted in IST, returns it unchanged to prevent double conversion.
     */
    public static String formatToIst(String utcIsoString) {
        if (utcIsoString == null || utcIsoString.isBlank()) {
            return null;
        }

        String trimmed = utcIsoString.trim();

        // Idempotency safeguard: if already formatted as IST, do not re-convert
        if (trimmed.endsWith("IST")) {
            return trimmed;
        }

        try {
            Instant instant = Instant.parse(trimmed);
            return IST_FORMATTER.format(instant);
        } catch (DateTimeParseException e) {
            return trimmed;
        }
    }

    /**
     * Formats an Instant directly to an IST formatted display string.
     */
    public static String formatToIst(Instant instant) {
        if (instant == null) {
            return null;
        }
        return IST_FORMATTER.format(instant);
    }

    /**
     * Parses an IST formatted string ("yyyy-MM-dd hh:mm:ss a IST") back to a UTC Instant.
     */
    public static Instant parseIstToInstant(String istString) {
        if (istString == null || istString.isBlank()) {
            return null;
        }
        return Instant.from(IST_FORMATTER.parse(istString.trim()));
    }
}
