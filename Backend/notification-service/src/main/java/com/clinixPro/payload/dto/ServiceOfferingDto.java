package com.clinixPro.payload.dto;

import lombok.Data;

@Data
public class ServiceOfferingDto {

    private Long id;

    private String name;

    private String description;

    private Integer price;

    private Integer duration;

    private Long clinicId;

    private String categoryId;

    private String image;
}