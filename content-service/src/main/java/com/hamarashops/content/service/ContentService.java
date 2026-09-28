package com.hamarashops.content.service;

import com.hamarashops.content.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContentService {

    private final ContentDataStore dataStore;

    public ContentService(ContentDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public List<ProductContent> getAllProducts() {
        return dataStore.getProducts();
    }

    public Optional<ProductContent> getProductBySlug(String slug) {
        return dataStore.getProducts().stream()
                .filter(p -> p.getSlug().equalsIgnoreCase(slug) || p.getId().equalsIgnoreCase(slug))
                .findFirst();
    }

    public List<SolutionContent> getAllSolutions() {
        return dataStore.getSolutions();
    }

    public Optional<SolutionContent> getSolutionBySlug(String slug) {
        return dataStore.getSolutions().stream()
                .filter(s -> s.getSlug().equalsIgnoreCase(slug) || s.getId().equalsIgnoreCase(slug))
                .findFirst();
    }

    public List<ServiceContent> getAllServices() {
        return dataStore.getServices();
    }

    public Optional<ServiceContent> getServiceBySlug(String slug) {
        return dataStore.getServices().stream()
                .filter(s -> s.getSlug().equalsIgnoreCase(slug) || s.getId().equalsIgnoreCase(slug))
                .findFirst();
    }

    public List<InsightContent> getAllInsights() {
        return dataStore.getInsights();
    }

    public Optional<InsightContent> getInsightBySlug(String slug) {
        return dataStore.getInsights().stream()
                .filter(i -> i.getSlug().equalsIgnoreCase(slug) || i.getId().equalsIgnoreCase(slug))
                .findFirst();
    }

    public CompanyContent getCompanyInfo() {
        return dataStore.getCompany();
    }

    public List<PartnerContent> getAllPartners() {
        return dataStore.getPartners();
    }

    public List<TestimonialContent> getAllTestimonials() {
        return dataStore.getTestimonials();
    }

    public List<IntegrationContent> getAllIntegrations() {
        return dataStore.getIntegrations();
    }

    public Optional<IntegrationContent> getIntegrationBySlug(String slug) {
        return dataStore.getIntegrations().stream()
                .filter(i -> i.getSlug().equalsIgnoreCase(slug) || i.getId().equalsIgnoreCase(slug))
                .findFirst();
    }

    public List<CaseStudyContent> getAllCaseStudies() {
        return dataStore.getCaseStudies();
    }

    public Optional<CaseStudyContent> getCaseStudyBySlug(String slug) {
        return dataStore.getCaseStudies().stream()
                .filter(cs -> cs.getSlug().equalsIgnoreCase(slug) || cs.getId().equalsIgnoreCase(slug))
                .findFirst();
    }

    public List<MetricContent> getAllMetrics() {
        return dataStore.getMetrics();
    }

    public List<SearchResult> searchContent(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String q = query.toLowerCase().trim();
        List<SearchResult> results = new ArrayList<>();

        for (ProductContent p : dataStore.getProducts()) {
            if (p.getTitle().toLowerCase().contains(q) || p.getDescription().toLowerCase().contains(q)) {
                results.add(new SearchResult(p.getId(), p.getTitle(), p.getDescription(), "product", "/products/" + p.getSlug()));
            }
        }

        for (SolutionContent s : dataStore.getSolutions()) {
            if (s.getTitle().toLowerCase().contains(q) || s.getSummary().toLowerCase().contains(q)) {
                results.add(new SearchResult(s.getId(), s.getTitle(), s.getSummary(), "solution", "/solutions/" + s.getSlug()));
            }
        }

        for (ServiceContent s : dataStore.getServices()) {
            if (s.getName().toLowerCase().contains(q) || s.getShortDescription().toLowerCase().contains(q)) {
                results.add(new SearchResult(s.getId(), s.getName(), s.getShortDescription(), "service", "/services/" + s.getSlug()));
            }
        }

        for (InsightContent i : dataStore.getInsights()) {
            if (i.getTitle().toLowerCase().contains(q) || (i.getDescription() != null && i.getDescription().toLowerCase().contains(q))) {
                results.add(new SearchResult(i.getId(), i.getTitle(), i.getDescription(), "insight", "/insights/" + i.getSlug()));
            }
        }

        for (IntegrationContent i : dataStore.getIntegrations()) {
            if (i.getName().toLowerCase().contains(q) || i.getDescription().toLowerCase().contains(q)) {
                results.add(new SearchResult(i.getId(), i.getName(), i.getDescription(), "integration", "/integrations/" + i.getSlug()));
            }
        }

        for (CaseStudyContent cs : dataStore.getCaseStudies()) {
            if (cs.getTitle().toLowerCase().contains(q) || cs.getSummary().toLowerCase().contains(q)) {
                results.add(new SearchResult(cs.getId(), cs.getTitle(), cs.getSummary(), "case-study", "/case-studies/" + cs.getSlug()));
            }
        }

        return results;
    }
}
