package com.clinixPro.payload.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class ClinicDto {

    private Long id;

    @NotBlank(message = "Clinic name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    private List<@Pattern(regexp = "^(http|https)://.*", message = "Image must be a valid URL") String> images;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    @NotNull(message = "Opening time is required")
    private LocalTime openTime;

    @NotNull(message = "Closing time is required")
    private LocalTime closeTime;

    @NotNull(message = "Description of clinic is required")
    private String description;

    // Business logic validation
    @JsonIgnore
    public boolean isValidOperatingHours() {
        return closeTime != null && openTime != null && closeTime.isAfter(openTime);
    }

}