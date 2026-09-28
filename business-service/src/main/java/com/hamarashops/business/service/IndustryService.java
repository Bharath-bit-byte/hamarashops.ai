package com.hamarashops.business.service;

import com.hamarashops.business.model.Industry;

import java.util.List;
import java.util.Optional;

public interface IndustryService {
    List<Industry> getAllIndustries();
    Optional<Industry> getIndustryBySlug(String slug);
}
