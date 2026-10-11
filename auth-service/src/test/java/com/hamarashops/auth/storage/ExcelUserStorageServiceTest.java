package com.hamarashops.auth.storage;

import com.hamarashops.auth.model.entity.User;
import org.apache.poi.ss.usermodel.*;
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

import static org.junit.jupiter.api.Assertions.*;

public class ExcelUserStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalFileStorageService fileStorageService;
    private ExcelUserStorageService excelUserStorageService;
    private String testExcelPath;

    @BeforeEach
    public void setUp() throws IOException {
        fileStorageService = new LocalFileStorageService();
        testExcelPath = tempDir.resolve("Test_Companies.xlsx").toString();

        // Create a realistic sample workbook mimicking Companies_Details.xlsx
        Workbook wb = new XSSFWorkbook();

        // 1. Existing "Companies" sheet
        Sheet companiesSheet = wb.createSheet("Companies");
        Row header = companiesSheet.createRow(0);
        String[] headers = {
                "ID", "company Name", "Client Name", "Active", "Last Sent", "Next Send",
                "Status", "Error", "Email Source", "Verification / Notes", "Degination",
                "company website", "email", "phone no.", "location"
        };
        for (int i = 0; i < headers.length; i++) {
            header.createCell(i).setCellValue(headers[i]);
        }

        // Add 1 sample company row
        Row sampleRow = companiesSheet.createRow(1);
        sampleRow.createCell(0).setCellValue(1.0);
        sampleRow.createCell(1).setCellValue("Atul Tiles");
        sampleRow.createCell(2).setCellValue("Kothandaraman Mohanakrishnan");
        sampleRow.createCell(3).setCellValue(1);
        sampleRow.createCell(12).setCellValue("info@anujtiles.com");

        // 2. Existing "Instructions" sheet
        Sheet instructionsSheet = wb.createSheet("Instructions");
        Row instRow = instructionsSheet.createRow(0);
        instRow.createCell(0).setCellValue("Field");
        instRow.createCell(1).setCellValue("Purpose");

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        wb.write(baos);
        wb.close();

        Files.write(Path.of(testExcelPath), baos.toByteArray());

        excelUserStorageService = new ExcelUserStorageService(
                fileStorageService,
                testExcelPath,
                "auth/Companies_Details.xlsx",
                "LOCAL"
        );
    }

    @Test
    @DisplayName("New LinkedIn user is added to dedicated 'LinkedIn Users' worksheet and preserves Companies and Instructions")
    public void testAppendNewUserToLinkedInUsersSheet() throws IOException {
        User user = new User(
                "urn:li:person:brand_new_1",
                "newuser@example.com",
                "Bruce",
                "Wayne",
                "Bruce Wayne",
                "https://example.com/bruce.jpg",
                true
        );

        user.setLinkedinProfileUrl("https://www.linkedin.com/in/brucewayne");
        excelUserStorageService.syncUserToExcel(user);

        // Read back and verify workbook
        byte[] bytes = fileStorageService.readBytes(testExcelPath);
        Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(bytes));

        // 1. Instructions sheet preserved untouched
        Sheet instSheet = wb.getSheet("Instructions");
        assertNotNull(instSheet, "Instructions sheet must be preserved");
        assertEquals("Field", instSheet.getRow(0).getCell(0).getStringCellValue());
        assertEquals("Purpose", instSheet.getRow(0).getCell(1).getStringCellValue());

        // 2. Companies sheet preserved untouched (1 header + 1 company row = 2 rows total)
        Sheet compSheet = wb.getSheet("Companies");
        assertNotNull(compSheet, "Companies sheet must be preserved");
        assertEquals(1, compSheet.getLastRowNum(), "Companies sheet must have exactly the original rows");
        Row origRow = compSheet.getRow(1);
        assertEquals("Atul Tiles", origRow.getCell(1).getStringCellValue());
        assertEquals("info@anujtiles.com", origRow.getCell(12).getStringCellValue());

        // 3. Dedicated 'LinkedIn Users' worksheet created and populated
        Sheet usersSheet = wb.getSheet("LinkedIn Users");
        assertNotNull(usersSheet, "Dedicated 'LinkedIn Users' worksheet must be created");

        // Header verification
        Row userHeader = usersSheet.getRow(0);
        assertNotNull(userHeader);
        assertEquals("LinkedIn ID", userHeader.getCell(0).getStringCellValue());
        assertEquals("Full Name", userHeader.getCell(1).getStringCellValue());
        assertEquals("First Name", userHeader.getCell(2).getStringCellValue());
        assertEquals("Last Name", userHeader.getCell(3).getStringCellValue());
        assertEquals("Email", userHeader.getCell(4).getStringCellValue());
        assertEquals("Email Verified", userHeader.getCell(5).getStringCellValue());
        assertEquals("Profile Picture URL", userHeader.getCell(6).getStringCellValue());
        assertEquals("LinkedIn Profile URL", userHeader.getCell(7).getStringCellValue());
        assertEquals("Provider", userHeader.getCell(8).getStringCellValue());
        assertEquals("Created At", userHeader.getCell(9).getStringCellValue());
        assertEquals("Updated At", userHeader.getCell(10).getStringCellValue());

        // Row 1 (new user) verification
        assertEquals(1, usersSheet.getLastRowNum());
        Row userRow = usersSheet.getRow(1);
        assertNotNull(userRow);
        assertEquals("urn:li:person:brand_new_1", userRow.getCell(0).getStringCellValue());
        assertEquals("Bruce Wayne", userRow.getCell(1).getStringCellValue());
        assertEquals("Bruce", userRow.getCell(2).getStringCellValue());
        assertEquals("Wayne", userRow.getCell(3).getStringCellValue());
        assertEquals("newuser@example.com", userRow.getCell(4).getStringCellValue());
        assertEquals("true", userRow.getCell(5).getStringCellValue());
        assertEquals("https://example.com/bruce.jpg", userRow.getCell(6).getStringCellValue());
        assertEquals("https://www.linkedin.com/in/brucewayne", userRow.getCell(7).getStringCellValue());
        assertEquals("LINKEDIN", userRow.getCell(8).getStringCellValue());
        assertTrue(userRow.getCell(9).getStringCellValue().endsWith("IST"));
        assertTrue(userRow.getCell(10).getStringCellValue().endsWith("IST"));

        wb.close();
    }

    @Test
    @DisplayName("Repeat login updates existing user's row in 'LinkedIn Users' sheet without duplicate row")
    public void testRepeatLoginUpdatesExistingRow() throws IOException {
        User user1 = new User("urn:li:person:repeat_user", "old@example.com", "Clark", "Kent", "Clark Kent", null, true);
        user1.setCreatedAt("2026-01-01T00:00:00Z");
        user1.setUpdatedAt("2026-01-01T00:00:00Z");
        excelUserStorageService.syncUserToExcel(user1);

        // User logs in again with updated name and email
        User user2 = new User("urn:li:person:repeat_user", "updated@example.com", "Kal", "El", "Superman", "https://example.com/superman.jpg", true);
        user2.setLinkedinProfileUrl("https://www.linkedin.com/in/clarkkent");
        user2.setCreatedAt("2026-01-01T00:00:00Z");
        user2.setUpdatedAt("2026-01-02T12:00:00Z");
        excelUserStorageService.syncUserToExcel(user2);

        byte[] bytes = fileStorageService.readBytes(testExcelPath);
        Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(bytes));
        Sheet usersSheet = wb.getSheet("LinkedIn Users");
        assertNotNull(usersSheet);

        // Should have Header (Row 0) and user (Row 1) - exactly 1 data row!
        assertEquals(1, usersSheet.getLastRowNum(), "Should not create duplicate row on repeat sign-in");

        Row updatedRow = usersSheet.getRow(1);
        assertEquals("urn:li:person:repeat_user", updatedRow.getCell(0).getStringCellValue());
        assertEquals("Superman", updatedRow.getCell(1).getStringCellValue());
        assertEquals("Kal", updatedRow.getCell(2).getStringCellValue());
        assertEquals("El", updatedRow.getCell(3).getStringCellValue());
        assertEquals("updated@example.com", updatedRow.getCell(4).getStringCellValue());
        assertEquals("https://www.linkedin.com/in/clarkkent", updatedRow.getCell(7).getStringCellValue());
        assertEquals("LINKEDIN", updatedRow.getCell(8).getStringCellValue());
        assertEquals("2026-01-01 05:30:00 AM IST", updatedRow.getCell(9).getStringCellValue(), "Original createdAt must be preserved in IST");
        assertEquals("2026-01-02 05:30:00 PM IST", updatedRow.getCell(10).getStringCellValue(), "updatedAt must be updated in IST");

        wb.close();
    }

    @Test
    @DisplayName("Missing workbook throws clear error and does not create empty replacement")
    public void testMissingWorkbookThrowsClearError() {
        String missingPath = tempDir.resolve("non_existent_workbook.xlsx").toString();
        ExcelUserStorageService missingService = new ExcelUserStorageService(
                fileStorageService,
                missingPath,
                "auth/Companies_Details.xlsx",
                "LOCAL"
        );

        User user = new User("urn:li:person:test", "test@example.com", "Test", "User", "Test User", null, true);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            missingService.syncUserToExcel(user);
        });

        assertTrue(ex.getMessage().contains("Required Excel workbook 'Companies_Details.xlsx' was not found"),
                "Exception message must clearly inform the developer about the missing workbook: " + ex.getMessage());
        assertFalse(Files.exists(Path.of(missingPath)), "Must NOT create an empty replacement workbook");
    }

    @Test
    @DisplayName("Missing optional fields are handled without error in 'LinkedIn Users' worksheet")
    public void testMissingOptionalFieldsHandled() throws IOException {
        User minimal = new User("urn:li:person:minimal_xl", "min@example.com", null, null, null, null, false);
        excelUserStorageService.syncUserToExcel(minimal);

        byte[] bytes = fileStorageService.readBytes(testExcelPath);
        Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(bytes));
        Sheet usersSheet = wb.getSheet("LinkedIn Users");
        assertNotNull(usersSheet);

        Row userRow = usersSheet.getRow(1);
        assertNotNull(userRow);
        assertEquals("urn:li:person:minimal_xl", userRow.getCell(0).getStringCellValue());
        assertEquals("min@example.com", userRow.getCell(4).getStringCellValue());
        assertEquals("false", userRow.getCell(5).getStringCellValue());

        wb.close();
    }

    @Test
    @DisplayName("Existing LinkedIn Users sheet with old 10-column layout is automatically migrated with LinkedIn Profile URL column")
    public void testMigrationOfExistingWorkbookWithoutProfileUrlHeader() throws IOException {
        // Create an existing workbook that already has the old 10-column LinkedIn Users sheet
        String oldWorkbookPath = tempDir.resolve("Old_Layout_Workbook.xlsx").toString();
        try (Workbook wb = new XSSFWorkbook()) {
            Sheet compSheet = wb.createSheet("Companies");
            compSheet.createRow(0).createCell(0).setCellValue("ID");

            Sheet usersSheet = wb.createSheet("LinkedIn Users");
            Row oldHeader = usersSheet.createRow(0);
            String[] oldHeaders = {
                    "LinkedIn ID", "Full Name", "First Name", "Last Name",
                    "Email", "Email Verified", "Profile Picture URL", "Provider",
                    "Created At", "Updated At"
            };
            for (int i = 0; i < oldHeaders.length; i++) {
                oldHeader.createCell(i).setCellValue(oldHeaders[i]);
            }

            // Existing user row in old layout
            Row oldUserRow = usersSheet.createRow(1);
            oldUserRow.createCell(0).setCellValue("existing_sub");
            oldUserRow.createCell(1).setCellValue("Existing User");
            oldUserRow.createCell(2).setCellValue("Existing");
            oldUserRow.createCell(3).setCellValue("User");
            oldUserRow.createCell(4).setCellValue("exist@example.com");
            oldUserRow.createCell(5).setCellValue("true");
            oldUserRow.createCell(6).setCellValue("https://example.com/pic.jpg");
            oldUserRow.createCell(7).setCellValue("LINKEDIN");
            oldUserRow.createCell(8).setCellValue("2026-10-10 10:00:00 AM IST");
            oldUserRow.createCell(9).setCellValue("2026-10-10 10:00:00 AM IST");

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            wb.write(baos);
            Files.write(Path.of(oldWorkbookPath), baos.toByteArray());
        }

        ExcelUserStorageService service = new ExcelUserStorageService(
                fileStorageService,
                oldWorkbookPath,
                "auth/Companies_Details.xlsx",
                "LOCAL"
        );

        // Sync a new user to trigger migration
        User newUser = new User("new_sub", "new@example.com", "New", "One", "New One", "https://example.com/new.jpg", true);
        newUser.setLinkedinProfileUrl("https://www.linkedin.com/in/newone");
        newUser.setCreatedAt("2026-10-10T12:00:00Z");
        newUser.setUpdatedAt("2026-10-10T12:00:00Z");

        service.syncUserToExcel(newUser);

        // Verify that old user row has shifted columns and empty profile URL, and new user has profile URL
        byte[] bytes = fileStorageService.readBytes(oldWorkbookPath);
        try (Workbook wb = new XSSFWorkbook(new ByteArrayInputStream(bytes))) {
            Sheet sheet = wb.getSheet("LinkedIn Users");
            Row header = sheet.getRow(0);
            assertEquals("LinkedIn Profile URL", header.getCell(7).getStringCellValue());
            assertEquals("Provider", header.getCell(8).getStringCellValue());
            assertEquals("Created At", header.getCell(9).getStringCellValue());
            assertEquals("Updated At", header.getCell(10).getStringCellValue());

            // Existing user row (Row 1): col 7 is empty, col 8 is LINKEDIN, col 9 is Created At, col 10 is Updated At
            Row row1 = sheet.getRow(1);
            assertEquals("existing_sub", row1.getCell(0).getStringCellValue());
            assertEquals("Existing User", row1.getCell(1).getStringCellValue());
            assertEquals("", row1.getCell(7).getStringCellValue());
            assertEquals("LINKEDIN", row1.getCell(8).getStringCellValue());
            assertEquals("2026-10-10 10:00:00 AM IST", row1.getCell(9).getStringCellValue());

            // New user row (Row 2): col 7 has profile url
            Row row2 = sheet.getRow(2);
            assertEquals("new_sub", row2.getCell(0).getStringCellValue());
            assertEquals("https://www.linkedin.com/in/newone", row2.getCell(7).getStringCellValue());
            assertEquals("LINKEDIN", row2.getCell(8).getStringCellValue());
        }
    }
}
