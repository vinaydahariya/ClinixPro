package com.clinixPro.payload.request;

import lombok.Data;

@Data
public class ReviewRequest {

    private String reviewText;
    private double rating;

}
