package com.hamarashops.content.model;

public class IntegrationContent {
    private String id;
    private String slug;
    private String name;
    private String category;
    private String description;
    private String status;
    private String icon;

    public IntegrationContent() {}

    public IntegrationContent(String id, String slug, String name, String category, String description, String status, String icon) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.category = category;
        this.description = description;
        this.status = status;
        this.icon = icon;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
