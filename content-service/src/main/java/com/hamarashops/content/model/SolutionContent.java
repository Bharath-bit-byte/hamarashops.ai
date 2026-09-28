package com.hamarashops.content.model;

import java.util.List;

public class SolutionContent {
    private String id;
    private String slug;
    private String title;
    private String subtitle;
    private String summary;
    private String industry;
    private String type;
    private List<String> keyBenefits;
    private List<String> components;

    public SolutionContent() {}

    public SolutionContent(String id, String slug, String title, String subtitle, String summary, String industry, String type, List<String> keyBenefits, List<String> components) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.subtitle = subtitle;
        this.summary = summary;
        this.industry = industry;
        this.type = type;
        this.keyBenefits = keyBenefits;
        this.components = components;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public List<String> getKeyBenefits() { return keyBenefits; }
    public void setKeyBenefits(List<String> keyBenefits) { this.keyBenefits = keyBenefits; }

    public List<String> getComponents() { return components; }
    public void setComponents(List<String> components) { this.components = components; }
}
