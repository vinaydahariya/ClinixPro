package com.clinixPro.payload.dto;

import com.clinixPro.domain.BookingStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingDto {

    private Long id;

    @NotNull(message = "Clinic ID is required")
    @Positive(message = "Clinic ID must be a positive number")
    private Long clinicId;

    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be a positive number")
    private Long customerId;

    @NotNull(message = "Start time is required")
    @FutureOrPresent(message = "Start time must be in the present or future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @NotEmpty(message = "At least one service ID must be selected")
    private Set<@Positive(message = "Service ID must be a positive number") Long> serviceIds;

    @NotNull(message = "Booking status is required")
    private BookingStatus bookingStatus;

    @Min(value = 0, message = "Total price must be 0 or more")
    private int totalPrice;

    private String userName;   // extra
    private String clinicName; // extra

    // ✅ NEW FIELDS for enriched response
    private ClinicDto clinic;             // Clinic name, images
    private UserDto userDto;
    private Set<ServiceOfferingDto> services; // Service name, category
    private LocalDateTime createdAt;

}
