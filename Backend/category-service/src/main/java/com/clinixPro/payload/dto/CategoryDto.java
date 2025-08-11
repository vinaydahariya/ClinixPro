package com.clinixPro.payload.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class CategoryDto {

    private String id; // Will be ignored during creation

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @URL(message = "Image must be a valid URL")
    @Pattern(regexp = "^(http|https)://.*", message = "Image URL must start with http:// or https://")
    private String image;

    @NotNull(message = "Clinic ID is required")
    private Long clinicId;
}