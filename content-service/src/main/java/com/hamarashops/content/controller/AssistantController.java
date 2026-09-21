package com.hamarashops.content.controller;

import com.hamarashops.content.service.AssistantKnowledgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assistant")
public class AssistantController {

    private final AssistantKnowledgeService assistantKnowledgeService;

    public AssistantController(AssistantKnowledgeService assistantKnowledgeService) {
        this.assistantKnowledgeService = assistantKnowledgeService;
    }

    @GetMapping("/context")
    public ResponseEntity<Map<String, Object>> getKnowledgeContext() {
        return ResponseEntity.ok(assistantKnowledgeService.getComprehensiveKnowledgeContext());
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions() {
        return ResponseEntity.ok(assistantKnowledgeService.getDynamicSuggestions());
    }
}