package com.hamarashops.auth.storage;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.auth.model.entity.User;
import com.hamarashops.auth.service.UserService;
import com.hamarashops.auth.serviceimpl.UserServiceImpl;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UserStorageIntegrationTest {

    @TempDir
    Path tempDir;

    private LocalFileStorageService fileStorageService;
    private JsonUserStorageService jsonUserStorageService;
    private ExcelUserStorageService excelUserStorageService;
    private UserService userService;

    private String testJsonPath;
    private String testExcelPath;

    @BeforeEach
    public void setUp() throws IOException {
        fileStorageService = new LocalFileStorageService();
        testJsonPath = tempDir.resolve("linkedin-users.json").toString();
        testExcelPath = tempDir.resolve("Companies_Details.xlsx").toString();

        // Setup base workbook with Companies and Instructions sheets
        try (Workbook wb = new XSSFWorkbook()) {
            Sheet compSheet = wb.createSheet("Companies");
            Row compHeader = compSheet.createRow(0);
            compHeader.createCell(0).setCellValue("ID");
            compHeader.createCell(1).setCellValue("company Name");
            compHeader.createCell(2).setCellValue("Client Name");
            compHeader.createCell(12).setCellValue("email");

            Row compRow1 = compSheet.createRow(1);
            compRow1.createCell(0).setCellValue(1.0);
            compRow1.createCell(1).setCellValue("Atul Tiles");
            compRow1.createCell(2).setCellValue("Kothandaraman Mohanakrishnan");
            compRow1.createCell(12).setCellValue("info@anujtiles.com");

            Sheet instSheet = wb.createSheet("Instructions");
            Row instHeader = instSheet.createRow(0);
            instHeader.createCell(0).setCellValue("Field");
            instHeader.createCell(1).setCellValue("Purpose");

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            wb.write(baos);
            Files.write(Path.of(testExcelPath), baos.toByteArray());
        }

        jsonUserStorageService = new JsonUserStorageService(
                fileStorageService,
                testJsonPath,
                "auth/linkedin-users.json",
                "LOCAL"
        );

        excelUserStorageService = new ExcelUserStorageService(
                fileStorageService,
                testExcelPath,
                "auth/Companies_Details.xlsx",
                "LOCAL"
        );

        userService = new UserServiceImpl(jsonUserStorageService, excelUserStorageService);
    }

    @Test
    @DisplayName("Regression: Repeated LinkedIn login advances updatedAt, preserves createdAt, and updates Excel row without duplicate")
    public void testRepeatedLoginUpdatesTimestampsInJsonAndExcel() throws Exception {
        String linkedinId = "CAJWu6KJua";
        String email = "gorantlacharanranga@gmail.com";

        // 1. Initial Login
        User initialUser = userService.processLinkedInUser(
                linkedinId,
                email,
                true,
                "Gorantla",
                "Charan Ranga",
                "Gorantla Charan Ranga",
                "https://example.com/avatar.jpg",
                "https://www.linkedin.com/in/charan-ranga"
        );

        assertNotNull(initialUser);
        assertEquals(linkedinId, initialUser.getLinkedinId());
        assertEquals("https://www.linkedin.com/in/charan-ranga", initialUser.getLinkedinProfileUrl());
        String initialCreatedAt = initialUser.getCreatedAt();
        String initialUpdatedAt = initialUser.getUpdatedAt();
        assertNotNull(initialCreatedAt);
        assertNotNull(initialUpdatedAt);

        // 2. Wait briefly to guarantee the next Instant.now() is strictly after the initial timestamp
        Thread.sleep(50);

        // 3. Repeat Login by the exact same user
        User repeatedUser = userService.processLinkedInUser(
                linkedinId,
                email,
                true,
                "Gorantla",
                "Charan Ranga",
                "Gorantla Charan Ranga",
                "https://example.com/avatar-updated.jpg",
                "https://www.linkedin.com/in/charan-ranga"
        );

        assertNotNull(repeatedUser);
        assertEquals(linkedinId, repeatedUser.getLinkedinId());
        assertEquals("https://www.linkedin.com/in/charan-ranga", repeatedUser.getLinkedinProfileUrl());

        // 4. Confirm in-memory entity timestamps
        assertEquals(initialCreatedAt, repeatedUser.getCreatedAt(), "createdAt must be preserved on repeated login");
        assertNotEquals(initialUpdatedAt, repeatedUser.getUpdatedAt(), "updatedAt must advance on repeated login");
        assertTrue(
                Instant.parse(repeatedUser.getUpdatedAt()).isAfter(Instant.parse(initialUpdatedAt)),
                "repeated login updatedAt (" + repeatedUser.getUpdatedAt() + ") must be after initial (" + initialUpdatedAt + ")"
        );

        // 5. Confirm file-on-disk JSON persistence
        byte[] jsonBytes = fileStorageService.readBytes(testJsonPath);
        ObjectMapper mapper = new ObjectMapper();
        List<User> persistedUsers = mapper.readValue(jsonBytes, new TypeReference<>() {});

        assertEquals(1, persistedUsers.size(), "JSON file must contain exactly 1 record (no duplicate)");
        User persistedUser = persistedUsers.get(0);
        assertEquals(linkedinId, persistedUser.getLinkedinId());
        assertEquals("https://www.linkedin.com/in/charan-ranga", persistedUser.getLinkedinProfileUrl());
        assertEquals(initialCreatedAt, persistedUser.getCreatedAt(), "persisted createdAt must match initial");
        assertEquals(repeatedUser.getUpdatedAt(), persistedUser.getUpdatedAt(), "persisted updatedAt must be updated");
        assertTrue(
                Instant.parse(persistedUser.getUpdatedAt()).isAfter(Instant.parse(initialUpdatedAt)),
                "persisted updatedAt must be newer than initial updatedAt"
        );

        // 6. Confirm Excel workbook persistence on disk
        byte[] excelBytes = fileStorageService.readBytes(testExcelPath);
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(excelBytes))) {
            // Instructions sheet preserved
            Sheet instSheet = wb.getSheet("Instructions");
            assertNotNull(instSheet);
            assertEquals("Field", instSheet.getRow(0).getCell(0).getStringCellValue());

            // Companies sheet preserved (only 1 company row)
            Sheet compSheet = wb.getSheet("Companies");
            assertNotNull(compSheet);
            assertEquals(1, compSheet.getLastRowNum(), "Companies sheet row count must be preserved");

            // LinkedIn Users sheet has exactly 1 data row
            Sheet usersSheet = wb.getSheet("LinkedIn Users");
            assertNotNull(usersSheet);
            assertEquals(1, usersSheet.getLastRowNum(), "LinkedIn Users sheet must have exactly 1 data row (no duplicates)");

            // Column Header check
            Row headerRow = usersSheet.getRow(0);
            assertEquals("LinkedIn Profile URL", headerRow.getCell(7).getStringCellValue());
            assertEquals("Provider", headerRow.getCell(8).getStringCellValue());
            assertEquals("Created At", headerRow.getCell(9).getStringCellValue());
            assertEquals("Updated At", headerRow.getCell(10).getStringCellValue());

            Row row = usersSheet.getRow(1);
            assertNotNull(row);
            assertEquals(linkedinId, row.getCell(0).getStringCellValue());
            assertEquals("Gorantla Charan Ranga", row.getCell(1).getStringCellValue());
            assertEquals(email, row.getCell(4).getStringCellValue());
            assertEquals("true", row.getCell(5).getStringCellValue());
            assertEquals("https://example.com/avatar-updated.jpg", row.getCell(6).getStringCellValue());
            assertEquals("https://www.linkedin.com/in/charan-ranga", row.getCell(7).getStringCellValue());
            assertEquals("LINKEDIN", row.getCell(8).getStringCellValue());

            // Column 9: Created At preserved in IST format
            String expectedCreatedIst = com.hamarashops.auth.util.DateTimeUtil.formatToIst(initialCreatedAt);
            String excelCreatedAt = row.getCell(9).getStringCellValue();
            assertEquals(expectedCreatedIst, excelCreatedAt, "Excel Created At must be preserved in IST");
            assertTrue(excelCreatedAt.endsWith("IST"), "Excel Created At must be in IST");

            // Column 10: Updated At advanced in IST format
            String expectedUpdatedIst = com.hamarashops.auth.util.DateTimeUtil.formatToIst(repeatedUser.getUpdatedAt());
            String excelUpdatedAt = row.getCell(10).getStringCellValue();
            assertEquals(expectedUpdatedIst, excelUpdatedAt, "Excel Updated At must match latest update in IST");
            assertTrue(excelUpdatedAt.endsWith("IST"), "Excel Updated At must be in IST");

            // Verify that JSON and Excel timestamps represent the exact same instant (to second precision)
            Instant jsonInstant = Instant.parse(persistedUser.getUpdatedAt()).truncatedTo(java.time.temporal.ChronoUnit.SECONDS);
            Instant excelInstant = com.hamarashops.auth.util.DateTimeUtil.parseIstToInstant(excelUpdatedAt);
            assertEquals(jsonInstant, excelInstant, "JSON UTC timestamp and Excel IST timestamp must represent the exact same instant");
        }
    }
}
