package com.clinixPro.payload.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
