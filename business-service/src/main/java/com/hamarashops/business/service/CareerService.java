package com.hamarashops.business.service;

import com.hamarashops.business.model.Career;

import java.util.List;
import java.util.Optional;

public interface CareerService {
    List<Career> getAllCareers();
    Optional<Career> getCareerByIdOrSlug(String identifier);
}
