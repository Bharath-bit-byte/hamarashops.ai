package com.hamarashops.content.model;

public class PartnerContent {
    private String id;
    private String name;
    private String category;
    private String type;
    private String description;
    private String logoUrl;
    private String website;

    public PartnerContent() {}

    public PartnerContent(String id, String name, String category, String type, String description, String logoUrl, String website) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.type = type;
        this.description = description;
        this.logoUrl = logoUrl;
        this.website = website;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
