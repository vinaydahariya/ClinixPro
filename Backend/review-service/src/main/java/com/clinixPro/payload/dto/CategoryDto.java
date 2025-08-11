package com.clinixPro.payload.dto;

import lombok.Data;

@Data
public class CategoryDto {

    private String id;
    private String name;
    private String image;
    private Long clinicId;
}