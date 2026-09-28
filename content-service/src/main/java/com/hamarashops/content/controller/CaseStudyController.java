package com.hamarashops.content.controller;

import com.hamarashops.content.exception.ResourceNotFoundException;
import com.hamarashops.content.model.CaseStudyContent;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/case-studies")
public class CaseStudyController {

    private final ContentService contentService;

    public CaseStudyController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<CaseStudyContent>> getAllCaseStudies() {
        return ResponseEntity.ok(contentService.getAllCaseStudies());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CaseStudyContent> getCaseStudyBySlug(@PathVariable String slug) {
        return contentService.getCaseStudyBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Case study not found with identifier: " + slug));
    }
}
