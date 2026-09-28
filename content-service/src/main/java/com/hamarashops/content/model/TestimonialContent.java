package com.hamarashops.content.model;

public class TestimonialContent {
    private String id;
    private String quote;
    private String company;
    private String author;
    private String clientName;
    private String designation;
    private Integer rating;
    private String avatarUrl;

    public TestimonialContent() {}

    public TestimonialContent(String id, String quote, String company, String author) {
        this.id = id;
        this.quote = quote;
        this.company = company;
        this.author = author;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
