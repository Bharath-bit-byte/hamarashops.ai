package com.hamarashops.content.model;

import java.util.List;

public class InsightContent {
    private String id;
    private String slug;
    private String title;
    private String type;
    private String description;
    private String category;
    private List<String> tags;
    private String url;

    public InsightContent() {}

    public InsightContent(String id, String slug, String title, String type, String description, String category, List<String> tags, String url) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.type = type;
        this.description = description;
        this.category = category;
        this.tags = tags;
        this.url = url;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
