package com.hamarashops.content.controller;

import com.hamarashops.content.exception.ResourceNotFoundException;
import com.hamarashops.content.model.ProductContent;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ContentService contentService;

    public ProductController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<ProductContent>> getAllProducts() {
        return ResponseEntity.ok(contentService.getAllProducts());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductContent> getProductBySlug(@PathVariable String slug) {
        return contentService.getProductBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with identifier: " + slug));
    }
}
