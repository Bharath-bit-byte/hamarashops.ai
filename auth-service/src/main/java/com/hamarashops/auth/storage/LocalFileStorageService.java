package com.hamarashops.auth.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.*;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Local filesystem implementation of FileStorageService.
 * Supports safe concurrent access and atomic writes via temporary files.
 * Guarantees that read and write operations resolve to the identical canonical path
 * regardless of whether the process was started from the repository root or the auth-service submodule.
 */
public class LocalFileStorageService implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalFileStorageService.class);
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    @Override
    public byte[] readBytes(String location) throws IOException {
        Path path = resolvePath(location);
        lock.readLock().lock();
        try {
            if (!Files.exists(path)) {
                throw new FileNotFoundException("File does not exist: " + path.toAbsolutePath());
            }
            return Files.readAllBytes(path);
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public void writeBytes(String location, byte[] data) throws IOException {
        Path targetPath = resolvePath(location);
        Path parent = targetPath.getParent();
        if (parent != null && !Files.exists(parent)) {
            Files.createDirectories(parent);
        }

        lock.writeLock().lock();
        Path tempFile = null;
        try {
            if (parent != null) {
                tempFile = Files.createTempFile(parent, ".hs-tmp-", ".tmp");
            } else {
                tempFile = Files.createTempFile(".hs-tmp-", ".tmp");
            }

            Files.write(tempFile, data, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);

            try {
                Files.move(tempFile, targetPath, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
            } catch (AtomicMoveNotSupportedException e) {
                log.debug("Atomic move not supported on current volume, falling back to replace existing: {}", e.getMessage());
                Files.move(tempFile, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            log.info("Persisted {} bytes to file: {}", data.length, targetPath.toAbsolutePath().normalize());
        } finally {
            if (tempFile != null && Files.exists(tempFile)) {
                try {
                    Files.deleteIfExists(tempFile);
                } catch (IOException ignored) {
                }
            }
            lock.writeLock().unlock();
        }
    }

    @Override
    public void updateWithRetry(String location, FileUpdater updater) throws IOException {
        Path targetPath = resolvePath(location);
        Path parent = targetPath.getParent();
        if (parent != null && !Files.exists(parent)) {
            Files.createDirectories(parent);
        }

        lock.writeLock().lock();
        Path tempFile = null;
        try {
            byte[] currentBytes = null;
            if (Files.exists(targetPath)) {
                currentBytes = Files.readAllBytes(targetPath);
            }

            byte[] newBytes;
            try {
                newBytes = updater.update(currentBytes);
            } catch (RuntimeException e) {
                throw e;
            } catch (IOException e) {
                throw e;
            } catch (Exception e) {
                throw new IOException("Failed during file update callback for: " + location, e);
            }

            if (newBytes == null) {
                log.debug("Updater returned null, skipping file write for: {}", location);
                return;
            }

            if (parent != null) {
                tempFile = Files.createTempFile(parent, ".hs-tmp-", ".tmp");
            } else {
                tempFile = Files.createTempFile(".hs-tmp-", ".tmp");
            }

            Files.write(tempFile, newBytes, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);

            try {
                Files.move(tempFile, targetPath, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
            } catch (AtomicMoveNotSupportedException e) {
                log.debug("Atomic move not supported on current volume, falling back to replace existing: {}", e.getMessage());
                Files.move(tempFile, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            log.info("Persisted updated file content to: {}", targetPath.toAbsolutePath().normalize());
        } finally {
            if (tempFile != null && Files.exists(tempFile)) {
                try {
                    Files.deleteIfExists(tempFile);
                } catch (IOException ignored) {
                }
            }
            lock.writeLock().unlock();
        }
    }

    @Override
    public boolean exists(String location) {
        Path path = resolvePath(location);
        lock.readLock().lock();
        try {
            return Files.exists(path);
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public String resolveReadableLocation(String location) {
        return resolvePath(location).toAbsolutePath().normalize().toString();
    }

    public Path resolvePath(String location) {
        Path direct = Paths.get(location);
        if (direct.isAbsolute()) {
            return direct.normalize();
        }

        // 1. If running from workspace root and child module (auth-service) contains the target file/folder
        Path childRelative = Paths.get("auth-service", location);
        if (Files.exists(childRelative) || (Files.isDirectory(Paths.get("auth-service")) && !Files.exists(direct))) {
            return childRelative.toAbsolutePath().normalize();
        }

        // 2. If the file exists directly in CWD
        if (Files.exists(direct)) {
            return direct.toAbsolutePath().normalize();
        }

        // 3. If running inside auth-service submodule and parent root has the file (e.g. ../Companies_Details.xlsx)
        Path parentRelative = Paths.get("..", location);
        if (Files.exists(parentRelative)) {
            return parentRelative.toAbsolutePath().normalize();
        }

        return direct.toAbsolutePath().normalize();
    }
}
