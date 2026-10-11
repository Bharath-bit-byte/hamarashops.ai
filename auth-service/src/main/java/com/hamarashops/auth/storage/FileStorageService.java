package com.hamarashops.auth.storage;

import java.io.IOException;

/**
 * Storage abstraction for persisting file assets (JSON user records and Excel workbooks)
 * across local filesystem and Google Cloud Storage (Cloud Run).
 */
public interface FileStorageService {

    /**
     * Functional callback for atomic read-modify-write operations.
     */
    @FunctionalInterface
    interface FileUpdater {
        /**
         * Computes the new file content given the current file content.
         *
         * @param currentData existing file bytes, or null if file does not exist
         * @return new file bytes to persist, or null if no update should be written
         * @throws Exception if update calculation fails
         */
        byte[] update(byte[] currentData) throws Exception;
    }

    /**
     * Reads all bytes from the target storage location.
     *
     * @param location local file path or cloud storage object path
     * @return byte array of file contents
     * @throws IOException if reading fails
     */
    byte[] readBytes(String location) throws IOException;

    /**
     * Writes data to the target storage location.
     *
     * @param location local file path or cloud storage object path
     * @param data bytes to write
     * @throws IOException if writing fails
     */
    void writeBytes(String location, byte[] data) throws IOException;

    /**
     * Performs a concurrency-safe read-modify-write operation with automatic retry
     * on concurrent conflict (e.g. GCS generation precondition mismatch).
     *
     * @param location storage location
     * @param updater modification function
     * @throws IOException if operation fails after retries
     */
    void updateWithRetry(String location, FileUpdater updater) throws IOException;

    /**
     * Checks if the resource exists at the storage location.
     *
     * @param location local file path or cloud storage object path
     * @return true if exists, false otherwise
     */
    boolean exists(String location);

    /**
     * Resolves the canonical or readable path for logging/diagnostics.
     *
     * @param location configured location
     * @return readable path description
     */
    String resolveReadableLocation(String location);
}
