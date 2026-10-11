package com.hamarashops.auth.storage;

import com.google.cloud.storage.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Google Cloud Storage implementation of FileStorageService for Cloud Run.
 * Uses Google Cloud Application Default Credentials (ADC) and durable bucket storage.
 *
 * NOTE ON CONCURRENCY:
 * In-process Java locks ONLY provide thread-safety within a single Cloud Run instance.
 * Distributed concurrency across multiple Cloud Run instances is enforced via
 * Google Cloud Storage object-generation preconditions (BlobTargetOption.generationMatch
 * or BlobTargetOption.doesNotExist) with optimistic read-modify-write retries on HTTP 412 conflicts.
 */
public class GcsFileStorageService implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(GcsFileStorageService.class);
    private static final int MAX_RETRIES = 8;
    private static final long INITIAL_BACKOFF_MS = 60;

    private final String bucketName;
    private final Storage storage;
    private final ReentrantReadWriteLock inProcessLock = new ReentrantReadWriteLock();

    public GcsFileStorageService(String bucketName) {
        this(bucketName, StorageOptions.getDefaultInstance().getService());
    }

    public GcsFileStorageService(String bucketName, Storage storage) {
        this.bucketName = bucketName;
        this.storage = storage;
        log.info("Initialized GCS File Storage on bucket: {}", bucketName);
    }

    @Override
    public byte[] readBytes(String location) throws IOException {
        String cleanPath = sanitizePath(location);
        inProcessLock.readLock().lock();
        try {
            Blob blob = storage.get(BlobId.of(bucketName, cleanPath));
            if (blob == null || !blob.exists()) {
                throw new FileNotFoundException("GCS object not found: gs://" + bucketName + "/" + cleanPath);
            }
            return blob.getContent();
        } finally {
            inProcessLock.readLock().unlock();
        }
    }

    @Override
    public void writeBytes(String location, byte[] data) throws IOException {
        String cleanPath = sanitizePath(location);
        inProcessLock.writeLock().lock();
        try {
            BlobId blobId = BlobId.of(bucketName, cleanPath);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
            storage.create(blobInfo, data);
            log.info("Persisted {} bytes to GCS: gs://{}/{}", data.length, bucketName, cleanPath);
        } finally {
            inProcessLock.writeLock().unlock();
        }
    }

    @Override
    public void updateWithRetry(String location, FileUpdater updater) throws IOException {
        String cleanPath = sanitizePath(location);
        BlobId blobId = BlobId.of(bucketName, cleanPath);

        inProcessLock.writeLock().lock();
        try {
            for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    Blob blob = storage.get(blobId);
                    byte[] currentData = null;
                    long generation = 0L;

                    if (blob != null && blob.exists()) {
                        currentData = blob.getContent();
                        generation = blob.getGeneration();
                    }

                    byte[] newData;
                    try {
                        newData = updater.update(currentData);
                    } catch (RuntimeException e) {
                        throw e;
                    } catch (IOException e) {
                        throw e;
                    } catch (Exception e) {
                        throw new IOException("Failed in update calculation for gs://" + bucketName + "/" + cleanPath, e);
                    }

                    if (newData == null) {
                        log.debug("Updater returned null, skipping GCS write for gs://{}/{}", bucketName, cleanPath);
                        return;
                    }

                    BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
                    Storage.BlobTargetOption preconditionOption = (generation == 0L)
                            ? Storage.BlobTargetOption.doesNotExist()
                            : Storage.BlobTargetOption.generationMatch(generation);

                    storage.create(blobInfo, newData, preconditionOption);
                    log.info("Successfully persisted {} bytes to GCS: gs://{}/{} (attempt {})",
                            newData.length, bucketName, cleanPath, attempt);
                    return;

                } catch (StorageException se) {
                    if (se.getCode() == 412) {
                        // Precondition Failed: Another instance modified the object concurrently
                        if (attempt < MAX_RETRIES) {
                            long backoff = (long) (INITIAL_BACKOFF_MS * Math.pow(1.5, attempt - 1))
                                    + (long) (Math.random() * 40);
                            log.warn("Concurrent update conflict (HTTP 412 Precondition Failed) on gs://{}/{} " +
                                            "(attempt {}/{}). Retrying in {}ms...",
                                    bucketName, cleanPath, attempt, MAX_RETRIES, backoff);
                            try {
                                Thread.sleep(backoff);
                            } catch (InterruptedException ie) {
                                Thread.currentThread().interrupt();
                                throw new IOException("Interrupted during concurrent retry for: " + cleanPath, ie);
                            }
                            continue;
                        } else {
                            log.error("Exceeded max retries ({}) due to concurrent updates on gs://{}/{}",
                                    MAX_RETRIES, bucketName, cleanPath);
                            throw new IOException("Failed to update GCS object after " + MAX_RETRIES +
                                    " attempts due to concurrent modifications: " + cleanPath, se);
                        }
                    } else {
                        throw new IOException("GCS storage error during update: " + se.getMessage(), se);
                    }
                }
            }
        } finally {
            inProcessLock.writeLock().unlock();
        }
    }

    @Override
    public boolean exists(String location) {
        String cleanPath = sanitizePath(location);
        inProcessLock.readLock().lock();
        try {
            Blob blob = storage.get(BlobId.of(bucketName, cleanPath));
            return blob != null && blob.exists();
        } finally {
            inProcessLock.readLock().unlock();
        }
    }

    @Override
    public String resolveReadableLocation(String location) {
        return "gs://" + bucketName + "/" + sanitizePath(location);
    }

    private String sanitizePath(String location) {
        if (location == null) {
            return "";
        }
        String path = location.replace('\\', '/');
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        return path;
    }
}
