package com.hamarashops.content.model;

import java.util.List;

public class ServiceContent {
    private String id;
    private String slug;
    private String name;
    private String shortDescription;
    private String fullDescription;
    private List<String> deliverables;
    private String serviceType;

    public ServiceContent() {}

    public ServiceContent(String id, String slug, String name, String shortDescription, String fullDescription, List<String> deliverables, String serviceType) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.deliverables = deliverables;
        this.serviceType = serviceType;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }

    public List<String> getDeliverables() { return deliverables; }
    public void setDeliverables(List<String> deliverables) { this.deliverables = deliverables; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
}
