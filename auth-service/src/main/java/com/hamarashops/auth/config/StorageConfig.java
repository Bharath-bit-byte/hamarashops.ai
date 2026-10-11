package com.hamarashops.auth.config;

import com.hamarashops.auth.storage.FileStorageService;
import com.hamarashops.auth.storage.GcsFileStorageService;
import com.hamarashops.auth.storage.LocalFileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfig {

    private static final Logger log = LoggerFactory.getLogger(StorageConfig.class);

    @Bean
    public FileStorageService fileStorageService(
            @Value("${storage.type:LOCAL}") String storageType,
            @Value("${storage.gcs.bucket-name:}") String gcsBucketName) {

        if ("GCS".equalsIgnoreCase(storageType) && gcsBucketName != null && !gcsBucketName.isBlank()) {
            log.info("Configuring Google Cloud Storage for durable user records on bucket: {}", gcsBucketName);
            return new GcsFileStorageService(gcsBucketName);
        }

        log.info("Configuring Local Filesystem Storage for user records");
        return new LocalFileStorageService();
    }

    @Bean
    public java.time.Clock clock() {
        return java.time.Clock.systemUTC();
    }
}
