package com.hamarashops.content.controller;

import com.hamarashops.content.model.SearchResult;
import com.hamarashops.content.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final ContentService contentService;

    public SearchController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<SearchResult>> searchContent(@RequestParam(name = "q", required = false, defaultValue = "") String query) {
        return ResponseEntity.ok(contentService.searchContent(query));
    }
}
