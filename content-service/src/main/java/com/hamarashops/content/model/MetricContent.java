package com.hamarashops.content.model;

public class MetricContent {
    private String id;
    private String label;
    private String value;
    private String description;
    private String category;
    private String association;

    public MetricContent() {}

    public MetricContent(String id, String label, String value, String description, String category, String association) {
        this.id = id;
        this.label = label;
        this.value = value;
        this.description = description;
        this.category = category;
        this.association = association;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAssociation() { return association; }
    public void setAssociation(String association) { this.association = association; }
}
