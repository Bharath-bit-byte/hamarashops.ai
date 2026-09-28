package com.hamarashops.business.model;

import java.util.List;

public class Career {
    private String id;
    private String slug;
    private String title;
    private String department;
    private String location;
    private String employmentType;
    private String description;
    private List<String> requirements;
    private List<String> responsibilities;

    public Career() {}

    public Career(String id, String slug, String title, String department, String location, String employmentType, String description, List<String> requirements, List<String> responsibilities) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.department = department;
        this.location = location;
        this.employmentType = employmentType;
        this.description = description;
        this.requirements = requirements;
        this.responsibilities = responsibilities;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }

    public List<String> getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(List<String> responsibilities) {
        this.responsibilities = responsibilities;
    }
}
