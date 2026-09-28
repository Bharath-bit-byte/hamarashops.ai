package com.hamarashops.content.controller;

import com.hamarashops.content.exception.ResourceNotFoundException;
import com.hamarashops.content.model.ServiceContent;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
public class ServiceController {

    private final ContentService contentService;

    public ServiceController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceContent>> getAllServices() {
        return ResponseEntity.ok(contentService.getAllServices());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ServiceContent> getServiceBySlug(@PathVariable String slug) {
        return contentService.getServiceBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with identifier: " + slug));
    }
}
