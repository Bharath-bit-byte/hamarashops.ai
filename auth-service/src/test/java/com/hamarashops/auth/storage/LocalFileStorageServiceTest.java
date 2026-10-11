package com.hamarashops.auth.storage;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class LocalFileStorageServiceTest {

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("LocalFileStorageService read, write, and updateWithRetry operate on identical canonical path")
    public void testReadWriteUseSamePath() throws IOException {
        LocalFileStorageService service = new LocalFileStorageService();
        Path testFile = tempDir.resolve("canonical-test.txt");
        String pathStr = testFile.toString();

        assertEquals(
                service.resolveReadableLocation(pathStr),
                service.resolvePath(pathStr).toString(),
                "resolveReadableLocation and resolvePath must match"
        );

        // Write
        service.writeBytes(pathStr, "initial-content".getBytes());
        assertTrue(service.exists(pathStr));
        assertEquals("initial-content", new String(service.readBytes(pathStr)));

        // Update with retry
        service.updateWithRetry(pathStr, current -> "updated-content".getBytes());
        assertEquals("updated-content", new String(service.readBytes(pathStr)));
        assertEquals("updated-content", Files.readString(testFile));
    }
}
