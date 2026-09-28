package com.hamarashops.business.controller;

import com.hamarashops.business.exception.ResourceNotFoundException;
import com.hamarashops.business.model.Industry;
import com.hamarashops.business.service.IndustryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/industries")
public class IndustryController {

    private final IndustryService industryService;

    public IndustryController(IndustryService industryService) {
        this.industryService = industryService;
    }

    @GetMapping
    public ResponseEntity<List<Industry>> getAllIndustries() {
        return ResponseEntity.ok(industryService.getAllIndustries());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Industry> getIndustryBySlug(@PathVariable String slug) {
        return industryService.getIndustryBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Industry not found with identifier: " + slug));
    }
}
