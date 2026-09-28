package com.hamarashops.content.model;

import java.util.List;

public class ProductContent {
    private String id;
    private String slug;
    private String title;
    private String tagline;
    private String description;
    private String category;
    private String icon;
    private List<String> features;
    private List<String> benefits;
    private List<String> useCases;
    private List<String> metrics;
    private List<String> targetAudience;

    public ProductContent() {}

    public ProductContent(String id, String slug, String title, String tagline, String description, String category, String icon, List<String> features, List<String> benefits, List<String> useCases, List<String> metrics, List<String> targetAudience) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.tagline = tagline;
        this.description = description;
        this.category = category;
        this.icon = icon;
        this.features = features;
        this.benefits = benefits;
        this.useCases = useCases;
        this.metrics = metrics;
        this.targetAudience = targetAudience;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }

    public List<String> getBenefits() { return benefits; }
    public void setBenefits(List<String> benefits) { this.benefits = benefits; }

    public List<String> getUseCases() { return useCases; }
    public void setUseCases(List<String> useCases) { this.useCases = useCases; }

    public List<String> getMetrics() { return metrics; }
    public void setMetrics(List<String> metrics) { this.metrics = metrics; }

    public List<String> getTargetAudience() { return targetAudience; }
    public void setTargetAudience(List<String> targetAudience) { this.targetAudience = targetAudience; }
}
