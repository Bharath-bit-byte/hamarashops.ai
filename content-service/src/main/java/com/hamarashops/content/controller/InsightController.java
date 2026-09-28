package com.hamarashops.content.controller;

import com.hamarashops.content.exception.ResourceNotFoundException;
import com.hamarashops.content.model.InsightContent;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/insights")
public class InsightController {

    private final ContentService contentService;

    public InsightController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<InsightContent>> getAllInsights() {
        return ResponseEntity.ok(contentService.getAllInsights());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<InsightContent> getInsightBySlug(@PathVariable String slug) {
        return contentService.getInsightBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Insight not found with identifier: " + slug));
    }
}
