package com.hamarashops.contact.model;

import java.util.List;

public class ContactInfo {
    private String companyName;
    private String headline;
    private String contactEmail;
    private String hubDescription;
    private List<String> inquiryCategories;

    public ContactInfo() {}

    public ContactInfo(String companyName, String headline, String contactEmail, String hubDescription, List<String> inquiryCategories) {
        this.companyName = companyName;
        this.headline = headline;
        this.contactEmail = contactEmail;
        this.hubDescription = hubDescription;
        this.inquiryCategories = inquiryCategories;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getHubDescription() {
        return hubDescription;
    }

    public void setHubDescription(String hubDescription) {
        this.hubDescription = hubDescription;
    }

    public List<String> getInquiryCategories() {
        return inquiryCategories;
    }

    public void setInquiryCategories(List<String> inquiryCategories) {
        this.inquiryCategories = inquiryCategories;
    }
}
