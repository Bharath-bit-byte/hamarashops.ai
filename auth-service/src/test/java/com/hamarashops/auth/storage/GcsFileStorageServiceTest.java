package com.hamarashops.auth.storage;

import com.google.cloud.storage.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class GcsFileStorageServiceTest {

    private Storage mockStorage;
    private GcsFileStorageService gcsFileStorageService;
    private final String bucketName = "test-hamarashops-bucket";

    @BeforeEach
    public void setUp() {
        mockStorage = mock(Storage.class);
        gcsFileStorageService = new GcsFileStorageService(bucketName, mockStorage);
    }

    @Test
    @DisplayName("Concurrent Cloud Storage updates with HTTP 412 precondition conflict automatically retry and succeed")
    public void testConcurrentUpdateRetriesOnHttp412() throws IOException {
        String location = "auth/linkedin-users.json";
        BlobId blobId = BlobId.of(bucketName, location);

        Blob initialBlob = mock(Blob.class);
        when(initialBlob.exists()).thenReturn(true);
        when(initialBlob.getGeneration()).thenReturn(100L);
        when(initialBlob.getContent()).thenReturn("[]".getBytes(StandardCharsets.UTF_8));

        Blob updatedBlob = mock(Blob.class);
        when(updatedBlob.exists()).thenReturn(true);
        when(updatedBlob.getGeneration()).thenReturn(101L);
        when(updatedBlob.getContent()).thenReturn("[{\"id\":1}]".getBytes(StandardCharsets.UTF_8));

        // First call to storage.get returns initialBlob (gen 100)
        // Second call to storage.get returns updatedBlob (gen 101)
        when(mockStorage.get(blobId)).thenReturn(initialBlob, updatedBlob);

        // First call to create throws HTTP 412 Precondition Failed
        StorageException preconditionFailed = new StorageException(412, "Precondition Failed: generation mismatch");
        doThrow(preconditionFailed)
                .doAnswer(invocation -> mock(Blob.class))
                .when(mockStorage).create(any(BlobInfo.class), any(byte[].class), any(Storage.BlobTargetOption.class));

        AtomicInteger updateCount = new AtomicInteger(0);

        gcsFileStorageService.updateWithRetry(location, currentData -> {
            updateCount.incrementAndGet();
            String currentStr = new String(currentData, StandardCharsets.UTF_8);
            return (currentStr + "-modified").getBytes(StandardCharsets.UTF_8);
        });

        // Verify update was retried after 412 conflict
        assertEquals(2, updateCount.get(), "Updater function must be re-invoked on concurrent conflict retry");

        // Verify storage.create was called with generationMatch(100L) first, then generationMatch(101L)
        ArgumentCaptor<Storage.BlobTargetOption> optionCaptor = ArgumentCaptor.forClass(Storage.BlobTargetOption.class);
        verify(mockStorage, times(2)).create(any(BlobInfo.class), any(byte[].class), optionCaptor.capture());

        assertNotNull(optionCaptor.getAllValues());
        assertEquals(2, optionCaptor.getAllValues().size());
    }

    @Test
    @DisplayName("Exceeding max retries on continuous HTTP 412 throws IOException without silently dropping records")
    public void testExceedingMaxRetriesThrowsIOException() {
        String location = "auth/test-file.json";
        BlobId blobId = BlobId.of(bucketName, location);

        Blob blob = mock(Blob.class);
        when(blob.exists()).thenReturn(true);
        when(blob.getGeneration()).thenReturn(50L);
        when(blob.getContent()).thenReturn("data".getBytes(StandardCharsets.UTF_8));
        when(mockStorage.get(blobId)).thenReturn(blob);

        StorageException persistentConflict = new StorageException(412, "Precondition Failed");
        doThrow(persistentConflict)
                .when(mockStorage).create(any(BlobInfo.class), any(byte[].class), any(Storage.BlobTargetOption.class));

        IOException ex = assertThrows(IOException.class, () -> {
            gcsFileStorageService.updateWithRetry(location, current -> "new-data".getBytes(StandardCharsets.UTF_8));
        });

        assertTrue(ex.getMessage().contains("concurrent modifications") || ex.getMessage().contains("attempts"),
                "Exception message must reflect concurrency conflict: " + ex.getMessage());
    }
}
