package com.hamarashops.content.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.content.model.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class ContentDataStore {

    private static final Logger log = LoggerFactory.getLogger(ContentDataStore.class);
    private final ObjectMapper mapper = new ObjectMapper();

    private List<ProductContent> products = new ArrayList<>();
    private List<SolutionContent> solutions = new ArrayList<>();
    private List<ServiceContent> services = new ArrayList<>();
    private List<InsightContent> insights = new ArrayList<>();
    private CompanyContent company = new CompanyContent();
    private List<PartnerContent> partners = new ArrayList<>();
    private List<TestimonialContent> testimonials = new ArrayList<>();
    private List<IntegrationContent> integrations = new ArrayList<>();
    private List<CaseStudyContent> caseStudies = new ArrayList<>();
    private List<MetricContent> metrics = new ArrayList<>();

    @PostConstruct
    public void loadData() {
        log.info("Loading Content Service JSON datasets into memory...");
        products = loadList("classpath:data/products.json", new TypeReference<List<ProductContent>>() {});
        solutions = loadList("classpath:data/solutions.json", new TypeReference<List<SolutionContent>>() {});
        services = loadList("classpath:data/services.json", new TypeReference<List<ServiceContent>>() {});
        insights = loadList("classpath:data/insights.json", new TypeReference<List<InsightContent>>() {});
        company = loadObject("classpath:data/company.json", CompanyContent.class);
        partners = loadList("classpath:data/partners.json", new TypeReference<List<PartnerContent>>() {});
        testimonials = loadList("classpath:data/testimonials.json", new TypeReference<List<TestimonialContent>>() {});
        integrations = loadList("classpath:data/integrations.json", new TypeReference<List<IntegrationContent>>() {});
        caseStudies = loadList("classpath:data/case-studies.json", new TypeReference<List<CaseStudyContent>>() {});
        metrics = loadList("classpath:data/metrics.json", new TypeReference<List<MetricContent>>() {});
        log.info("Content Service datasets successfully loaded.");
    }

    private <T> List<T> loadList(String resourcePath, TypeReference<List<T>> typeRef) {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource resource = resolver.getResource(resourcePath);
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    return mapper.readValue(is, typeRef);
                }
            }
        } catch (Exception e) {
            log.error("Failed to load JSON data from {}: {}", resourcePath, e.getMessage());
        }
        return Collections.emptyList();
    }

    private <T> T loadObject(String resourcePath, Class<T> clazz) {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource resource = resolver.getResource(resourcePath);
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    return mapper.readValue(is, clazz);
                }
            }
        } catch (Exception e) {
            log.error("Failed to load JSON object from {}: {}", resourcePath, e.getMessage());
        }
        try {
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception ex) {
            return null;
        }
    }

    public List<ProductContent> getProducts() { return products; }
    public List<SolutionContent> getSolutions() { return solutions; }
    public List<ServiceContent> getServices() { return services; }
    public List<InsightContent> getInsights() { return insights; }
    public CompanyContent getCompany() { return company; }
    public List<PartnerContent> getPartners() { return partners; }
    public List<TestimonialContent> getTestimonials() { return testimonials; }
    public List<IntegrationContent> getIntegrations() { return integrations; }
    public List<CaseStudyContent> getCaseStudies() { return caseStudies; }
    public List<MetricContent> getMetrics() { return metrics; }
}
