package com.hamarashops.content.model;

public class CaseStudyContent {
    private String id;
    private String slug;
    private String title;
    private String client;
    private String industry;
    private String summary;
    private String impact;

    public CaseStudyContent() {}

    public CaseStudyContent(String id, String slug, String title, String client, String industry, String summary, String impact) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.client = client;
        this.industry = industry;
        this.summary = summary;
        this.impact = impact;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getImpact() { return impact; }
    public void setImpact(String impact) { this.impact = impact; }
}
