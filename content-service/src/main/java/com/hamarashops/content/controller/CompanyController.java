package com.hamarashops.content.controller;

import com.hamarashops.content.model.CompanyContent;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/company")
public class CompanyController {

    private final ContentService contentService;

    public CompanyController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<CompanyContent> getCompanyInfo() {
        return ResponseEntity.ok(contentService.getCompanyInfo());
    }
}
