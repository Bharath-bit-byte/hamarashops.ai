package com.hamarashops.content.controller;

import com.hamarashops.content.model.PartnerContent;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/partners")
public class PartnerController {

    private final ContentService contentService;

    public PartnerController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<PartnerContent>> getAllPartners() {
        return ResponseEntity.ok(contentService.getAllPartners());
    }
}
