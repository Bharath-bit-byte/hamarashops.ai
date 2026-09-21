package com.hamarashops.content;

import com.hamarashops.content.model.*;
import com.hamarashops.content.service.AssistantKnowledgeService;
import com.hamarashops.content.service.ContentDataStore;
import com.hamarashops.content.service.ContentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AssistantKnowledgeTest {

    @Autowired
    private ContentDataStore dataStore;

    @Autowired
    private ContentService contentService;

    @Autowired
    private AssistantKnowledgeService assistantKnowledgeService;

    @Test
    void testProductsLoaded() {
        List<ProductContent> products = dataStore.getProducts();
        assertNotNull(products);
        assertEquals(6, products.size());
        assertTrue(products.stream().anyMatch(p -> p.getSlug().equals("cognitive-automation-engine")));
        assertTrue(products.stream().anyMatch(p -> p.getSlug().equals("conversational-commerce-concierge")));
    }

    @Test
    void testSolutionsLoaded() {
        List<SolutionContent> solutions = dataStore.getSolutions();
        assertNotNull(solutions);
        assertEquals(5, solutions.size());
        assertTrue(solutions.stream().anyMatch(s -> s.getSlug().equals("wendys-freshai-automation")));
    }

    @Test
    void testSearchContent() {
        List<SearchResult> results = contentService.searchContent("automation");
        assertNotNull(results);
        assertFalse(results.isEmpty());
    }

    @Test
    void testAssistantKnowledgeContext() {
        Map<String, Object> context = assistantKnowledgeService.getComprehensiveKnowledgeContext();
        assertNotNull(context);
        assertTrue(context.containsKey("products"));
        assertTrue(context.containsKey("solutions"));
        assertTrue(context.containsKey("metrics"));
        assertTrue(context.containsKey("company"));
    }
}