package com.hamarashops.business.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Industry {
    private String id;
    private String slug;
    private String name;
    private String subtitle;
    private String description;
    private String category;
    private List<String> keyCapabilities;
    private List<Object> useCases;
    private List<String> impactMetrics;
    private List<Map<String, String>> overviewStats;
    private List<String> aiComponents;
    private List<String> businessMetrics;

    public Industry() {}

    public Industry(String id, String slug, String name, String subtitle, String description, String category, List<String> keyCapabilities, List<Object> useCases, List<String> impactMetrics, List<Map<String, String>> overviewStats, List<String> aiComponents, List<String> businessMetrics) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.subtitle = subtitle;
        this.description = description;
        this.category = category;
        this.keyCapabilities = keyCapabilities;
        this.useCases = useCases;
        this.impactMetrics = impactMetrics;
        this.overviewStats = overviewStats;
        this.aiComponents = aiComponents;
        this.businessMetrics = businessMetrics;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getKeyCapabilities() {
        return keyCapabilities;
    }

    public void setKeyCapabilities(List<String> keyCapabilities) {
        this.keyCapabilities = keyCapabilities;
    }

    public List<Object> getUseCases() {
        return useCases;
    }

    public void setUseCases(List<Object> useCases) {
        this.useCases = useCases;
    }

    public List<String> getImpactMetrics() {
        return impactMetrics;
    }

    public void setImpactMetrics(List<String> impactMetrics) {
        this.impactMetrics = impactMetrics;
    }

    public List<Map<String, String>> getOverviewStats() {
        return overviewStats;
    }

    public void setOverviewStats(List<Map<String, String>> overviewStats) {
        this.overviewStats = overviewStats;
    }

    public List<String> getAiComponents() {
        return aiComponents;
    }

    public void setAiComponents(List<String> aiComponents) {
        this.aiComponents = aiComponents;
    }

    public List<String> getBusinessMetrics() {
        return businessMetrics;
    }

    public void setBusinessMetrics(List<String> businessMetrics) {
        this.businessMetrics = businessMetrics;
    }
}
