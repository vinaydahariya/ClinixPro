package com.clinixPro.payload.response;

import lombok.Data;

@Data
public class ReviewResponseDto {
    private Long id;
    private String reviewText;
    private double rating;
    private Long clinicId;
    private Long userId;
    private String userName;   // ✅ New
    private String userImage;  // ✅ New
    private String createdAt;
}