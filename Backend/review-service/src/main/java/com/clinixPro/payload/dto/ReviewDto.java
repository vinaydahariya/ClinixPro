package com.clinixPro.payload.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ReviewDto {

    private Long id;

    @NotBlank(message = "Review text is required")
    private String reviewText;

    @PositiveOrZero(message = "Rating must be a positive number or zero")
    private double rating;

    @NotNull(message = "Clinic ID is required")
    private Long clinicId;

    @NotNull(message = "User ID is required")
    private Long userId;
}
