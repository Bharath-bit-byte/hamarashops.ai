package com.hamarashops.content.service;

import com.hamarashops.content.model.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AssistantKnowledgeService {

    private final ContentDataStore dataStore;

    public AssistantKnowledgeService(ContentDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public Map<String, Object> getComprehensiveKnowledgeContext() {
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("company", dataStore.getCompany());
        context.put("metrics", dataStore.getMetrics());
        context.put("partners", dataStore.getPartners());
        context.put("testimonials", dataStore.getTestimonials());
        context.put("integrations", dataStore.getIntegrations());
        context.put("products", dataStore.getProducts());
        context.put("solutions", dataStore.getSolutions());
        context.put("services", dataStore.getServices());
        return context;
    }

    public List<String> getDynamicSuggestions() {
        List<String> suggestions = new ArrayList<>();
        suggestions.add("Explore Cognitive Automation Engine");
        suggestions.add("How does Wendy's FreshAI work?");
        suggestions.add("Healthcare AI (MedPaLM & EHR)");
        suggestions.add("Financial Contract Intelligence (LIBOR)");
        suggestions.add("Verified Scale (200+ Models, 99.9% Precision)");
        suggestions.add("Book Engineering Consultation");
        return suggestions;
    }
}