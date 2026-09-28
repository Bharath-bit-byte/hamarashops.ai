package com.hamarashops.content.model;

public class SearchResult {
    private String id;
    private String title;
    private String snippet;
    private String type; // e.g. "product", "solution", "service", "insight"
    private String url;

    public SearchResult() {}

    public SearchResult(String id, String title, String snippet, String type, String url) {
        this.id = id;
        this.title = title;
        this.snippet = snippet;
        this.type = type;
        this.url = url;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSnippet() { return snippet; }
    public void setSnippet(String snippet) { this.snippet = snippet; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
