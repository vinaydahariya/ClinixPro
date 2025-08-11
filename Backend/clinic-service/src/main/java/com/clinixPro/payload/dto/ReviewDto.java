package com.clinixPro.payload.dto;

import lombok.Data;

@Data
public class ReviewDto {

    private Long id;
    private String reviewText;
    private double rating;
    private Long clinicId;
    private Long userId;
}
