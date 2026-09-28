package com.hamarashops.business.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.business.model.Career;
import com.hamarashops.business.model.Industry;
import com.hamarashops.business.service.CareerService;
import com.hamarashops.business.service.IndustryService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class BusinessContentServiceImpl implements IndustryService, CareerService {

    private static final Logger log = LoggerFactory.getLogger(BusinessContentServiceImpl.class);

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    private List<Industry> industries = new ArrayList<>();
    private List<Career> careers = new ArrayList<>();

    public BusinessContentServiceImpl(ResourceLoader resourceLoader, ObjectMapper objectMapper) {
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        log.info("Initializing Business Service JSON datasets...");
        this.industries = loadData("classpath:data/industries.json", new TypeReference<List<Industry>>() {});
        this.careers = loadData("classpath:data/careers.json", new TypeReference<List<Career>>() {});
        log.info("Loaded {} industry records into Business Service.", industries.size());
    }

    private <T> List<T> loadData(String path, TypeReference<List<T>> typeReference) {
        try {
            Resource resource = resourceLoader.getResource(path);
            if (!resource.exists()) {
                log.warn("Resource path does not exist: {}", path);
                return Collections.emptyList();
            }
            try (InputStream inputStream = resource.getInputStream()) {
                return objectMapper.readValue(inputStream, typeReference);
            }
        } catch (Exception e) {
            log.error("Failed to parse JSON data from {}: {}", path, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    public List<Industry> getAllIndustries() {
        return Collections.unmodifiableList(industries);
    }

    @Override
    public Optional<Industry> getIndustryBySlug(String slug) {
        return industries.stream()
                .filter(i -> (i.getSlug() != null && i.getSlug().equalsIgnoreCase(slug)) || 
                             (i.getId() != null && i.getId().equalsIgnoreCase(slug)))
                .findFirst();
    }

    @Override
    public List<Career> getAllCareers() {
        return Collections.unmodifiableList(careers);
    }

    @Override
    public Optional<Career> getCareerByIdOrSlug(String identifier) {
        return careers.stream()
                .filter(c -> (c.getId() != null && c.getId().equalsIgnoreCase(identifier)) || 
                             (c.getSlug() != null && c.getSlug().equalsIgnoreCase(identifier)))
                .findFirst();
    }
}
