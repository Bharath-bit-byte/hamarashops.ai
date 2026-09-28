package com.hamarashops.business.controller;

import com.hamarashops.business.exception.ResourceNotFoundException;
import com.hamarashops.business.model.Career;
import com.hamarashops.business.service.CareerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/careers")
public class CareerController {

    private final CareerService careerService;

    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    @GetMapping
    public ResponseEntity<List<Career>> getAllCareers() {
        return ResponseEntity.ok(careerService.getAllCareers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Career> getCareerByIdOrSlug(@PathVariable String id) {
        return careerService.getCareerByIdOrSlug(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Career opening not found with identifier: " + id));
    }
}
