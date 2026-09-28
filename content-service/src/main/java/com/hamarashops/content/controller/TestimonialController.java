package com.hamarashops.content.controller;

import com.hamarashops.content.model.TestimonialContent;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/testimonials")
public class TestimonialController {

    private final ContentService contentService;

    public TestimonialController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<TestimonialContent>> getAllTestimonials() {
        return ResponseEntity.ok(contentService.getAllTestimonials());
    }
}
