package com.hamarashops.content.controller;

import com.hamarashops.content.model.MetricContent;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/metrics")
public class MetricController {

    private final ContentService contentService;

    public MetricController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<MetricContent>> getAllMetrics() {
        return ResponseEntity.ok(contentService.getAllMetrics());
    }
}
