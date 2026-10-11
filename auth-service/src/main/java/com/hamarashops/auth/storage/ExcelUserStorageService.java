package com.hamarashops.auth.storage;

import com.hamarashops.auth.model.entity.User;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.Instant;
import com.hamarashops.auth.util.DateTimeUtil;

/**
 * Service managing synchronization of authenticated LinkedIn users with the Excel workbook.
 * Preserves the existing 'Companies' and 'Instructions' worksheets, their data, formatting,
 * formulas, and columns completely untouched.
 *
 * Dedicated sheet 'LinkedIn Users' records authenticated LinkedIn members.
 */
@Service
public class ExcelUserStorageService {

    private static final Logger log = LoggerFactory.getLogger(ExcelUserStorageService.class);

    public static final String LINKEDIN_USERS_SHEET = "LinkedIn Users";

    public static final String[] HEADERS = {
            "LinkedIn ID",
            "Full Name",
            "First Name",
            "Last Name",
            "Email",
            "Email Verified",
            "Profile Picture URL",
            "LinkedIn Profile URL",
            "Provider",
            "Created At",
            "Updated At"
    };

    private final FileStorageService fileStorageService;
    private final String excelPath;
    private final java.time.Clock clock;

    @org.springframework.beans.factory.annotation.Autowired
    public ExcelUserStorageService(
            FileStorageService fileStorageService,
            @Value("${storage.local.excel-path:Companies_Details.xlsx}") String localExcelPath,
            @Value("${storage.gcs.excel-path:auth/Companies_Details.xlsx}") String gcsExcelPath,
            @Value("${storage.type:LOCAL}") String storageType,
            java.time.Clock clock) {

        this.fileStorageService = fileStorageService;
        this.excelPath = "GCS".equalsIgnoreCase(storageType) ? gcsExcelPath : localExcelPath;
        this.clock = clock != null ? clock : java.time.Clock.systemUTC();

        log.info("Initialized ExcelUserStorageService targeting workbook: {}", fileStorageService.resolveReadableLocation(this.excelPath));
    }

    public ExcelUserStorageService(
            FileStorageService fileStorageService,
            String localExcelPath,
            String gcsExcelPath,
            String storageType) {
        this(fileStorageService, localExcelPath, gcsExcelPath, storageType, java.time.Clock.systemUTC());
    }

    /**
     * Reads and returns the raw bytes of the current authoritative Excel workbook.
     */
    public byte[] getLatestWorkbookBytes() throws IOException {
        if (!fileStorageService.exists(excelPath)) {
            throw new FileNotFoundException("Excel workbook not found at: " + fileStorageService.resolveReadableLocation(excelPath));
        }
        return fileStorageService.readBytes(excelPath);
    }

    /**
     * Synchronizes a user record to the Excel workbook's 'LinkedIn Users' worksheet.
     * Updates the user's row if their LinkedIn ID is present; appends a new row otherwise.
     * Uses atomic read-modify-write with precondition retry protection.
     */
    public synchronized void syncUserToExcel(User user) {
        if (user == null || user.getLinkedinId() == null || user.getLinkedinId().isBlank()) {
            log.warn("Cannot sync null user or empty LinkedIn ID to Excel");
            return;
        }

        try {
            fileStorageService.updateWithRetry(excelPath, currentBytes -> {
                if (currentBytes == null || currentBytes.length == 0) {
                    throw new FileNotFoundException(
                            "Required Excel workbook 'Companies_Details.xlsx' was not found at configured path: "
                                    + fileStorageService.resolveReadableLocation(excelPath)
                                    + ". On a fresh clone, you must supply the master Companies_Details.xlsx in the project root "
                                    + "or configure GCS bucket storage. See README.md for setup instructions.");
                }

                try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(currentBytes))) {
                    Sheet usersSheet = workbook.getSheet(LINKEDIN_USERS_SHEET);
                    if (usersSheet == null) {
                        log.info("Creating separate worksheet '{}' in workbook", LINKEDIN_USERS_SHEET);
                        usersSheet = workbook.createSheet(LINKEDIN_USERS_SHEET);
                        createHeaderRow(workbook, usersSheet);
                    } else {
                        ensureHeaders(workbook, usersSheet);
                    }

                    updateOrAppendUser(usersSheet, user);

                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    workbook.write(baos);
                    return baos.toByteArray();
                }
            });

            log.info("Successfully synchronized LinkedIn user [{}] to '{}' sheet in Excel workbook at {}",
                    user.getLinkedinId(), LINKEDIN_USERS_SHEET, excelPath);

        } catch (Exception e) {
            log.error("Failed to update Excel workbook at {}: {}", excelPath, e.getMessage(), e);
            throw new IllegalStateException("Failed to update Excel workbook: " + e.getMessage(), e);
        }
    }

    public String getExcelPath() {
        return excelPath;
    }

    private void ensureHeaders(Workbook workbook, Sheet sheet) {
        Row headerRow = sheet.getRow(0);
        if (headerRow == null) {
            createHeaderRow(workbook, sheet);
            return;
        }

        boolean hasProfileUrlHeader = false;
        int lastCol = headerRow.getLastCellNum();
        for (int i = 0; i < lastCol; i++) {
            Cell cell = headerRow.getCell(i);
            if (cell != null && "LinkedIn Profile URL".equalsIgnoreCase(getCellStringValue(cell).trim())) {
                hasProfileUrlHeader = true;
                break;
            }
        }

        if (!hasProfileUrlHeader) {
            log.info("Migrating '{}' worksheet to include 'LinkedIn Profile URL' column", LINKEDIN_USERS_SHEET);
            int insertIndex = 7;
            int lastRowNum = sheet.getLastRowNum();
            for (int r = 1; r <= lastRowNum; r++) {
                Row row = sheet.getRow(r);
                if (row != null) {
                    int rowLastCell = row.getLastCellNum();
                    for (int c = rowLastCell; c >= insertIndex; c--) {
                        Cell fromCell = row.getCell(c);
                        if (fromCell != null) {
                            Cell toCell = row.getCell(c + 1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                            toCell.setCellValue(getCellStringValue(fromCell));
                        }
                    }
                    Cell newCell = row.getCell(insertIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    newCell.setCellValue("");
                }
            }

            createHeaderRow(workbook, sheet);
        }
    }

    private void createHeaderRow(Workbook workbook, Sheet sheet) {
        Row headerRow = sheet.getRow(0);
        if (headerRow == null) {
            headerRow = sheet.createRow(0);
        }
        CellStyle headerStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        headerStyle.setFont(font);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        for (int i = 0; i < HEADERS.length; i++) {
            Cell cell = headerRow.getCell(i, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
            cell.setCellValue(HEADERS[i]);
            cell.setCellStyle(headerStyle);
        }

        for (int i = 0; i < HEADERS.length; i++) {
            sheet.setColumnWidth(i, 22 * 256);
        }
    }

    private void updateOrAppendUser(Sheet sheet, User user) {
        int existingRowIndex = -1;
        int lastRowNum = sheet.getLastRowNum();

        for (int r = 1; r <= lastRowNum; r++) {
            Row row = sheet.getRow(r);
            if (row != null) {
                Cell cell = row.getCell(0);
                if (cell != null) {
                    String existingId = getCellStringValue(cell).trim();
                    if (user.getLinkedinId().equalsIgnoreCase(existingId)) {
                        existingRowIndex = r;
                        break;
                    }
                }
            }
        }

        String nowUtc = clock.instant().toString();
        String userCreatedAtIst = DateTimeUtil.formatToIst(user.getCreatedAt() != null ? user.getCreatedAt() : nowUtc);
        String userUpdatedAtIst = DateTimeUtil.formatToIst(user.getUpdatedAt() != null ? user.getUpdatedAt() : nowUtc);

        if (existingRowIndex != -1) {
            Row row = sheet.getRow(existingRowIndex);
            log.info("Updating existing row {} in '{}' for LinkedIn ID: {}",
                    existingRowIndex + 1, LINKEDIN_USERS_SHEET, user.getLinkedinId());

            setCell(row, 1, user.getName() != null ? user.getName() : "");
            setCell(row, 2, user.getFirstName() != null ? user.getFirstName() : "");
            setCell(row, 3, user.getLastName() != null ? user.getLastName() : "");
            setCell(row, 4, user.getEmail() != null ? user.getEmail() : "");
            setCell(row, 5, String.valueOf(Boolean.TRUE.equals(user.getEmailVerified())));
            setCell(row, 6, user.getPictureUrl() != null ? user.getPictureUrl() : "");
            setCell(row, 7, user.getLinkedinProfileUrl() != null ? user.getLinkedinProfileUrl() : "");
            setCell(row, 8, user.getProvider() != null ? user.getProvider() : "LINKEDIN");

            // Col 9: Preserve existing Created At if present; set if empty
            Cell createdCell = row.getCell(9);
            if (createdCell == null || getCellStringValue(createdCell).isBlank()) {
                setCell(row, 9, userCreatedAtIst);
            } else {
                // Preserve existing Created At; convert to IST display format if needed
                String existingCreated = getCellStringValue(createdCell).trim();
                setCell(row, 9, DateTimeUtil.formatToIst(existingCreated));
            }

            // Col 10: Updated At (always update to latest canonical record timestamp converted to IST)
            setCell(row, 10, userUpdatedAtIst);

        } else {
            int newRowIndex = lastRowNum + 1;
            if (newRowIndex < 1) newRowIndex = 1;
            Row row = sheet.createRow(newRowIndex);
            log.info("Appending new row {} in '{}' for LinkedIn ID: {}",
                    newRowIndex + 1, LINKEDIN_USERS_SHEET, user.getLinkedinId());

            setCell(row, 0, user.getLinkedinId());
            setCell(row, 1, user.getName() != null ? user.getName() : "");
            setCell(row, 2, user.getFirstName() != null ? user.getFirstName() : "");
            setCell(row, 3, user.getLastName() != null ? user.getLastName() : "");
            setCell(row, 4, user.getEmail() != null ? user.getEmail() : "");
            setCell(row, 5, String.valueOf(Boolean.TRUE.equals(user.getEmailVerified())));
            setCell(row, 6, user.getPictureUrl() != null ? user.getPictureUrl() : "");
            setCell(row, 7, user.getLinkedinProfileUrl() != null ? user.getLinkedinProfileUrl() : "");
            setCell(row, 8, user.getProvider() != null ? user.getProvider() : "LINKEDIN");
            setCell(row, 9, userCreatedAtIst);
            setCell(row, 10, userUpdatedAtIst);
        }
    }

    private void setCell(Row row, int colIndex, String value) {
        Cell cell = row.getCell(colIndex, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
        cell.setCellValue(value != null ? value : "");
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
}
