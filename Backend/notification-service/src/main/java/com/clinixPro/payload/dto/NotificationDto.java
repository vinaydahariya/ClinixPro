package com.clinixPro.payload.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDto {

    private Long id;

    @NotBlank(message = "Notification type is required")
    private String type;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Read status must be specified")
    private Boolean isRead = false;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Clinic ID is required")
    private Long clinicId;

    private LocalDateTime createdAt;

    @NotNull(message = "BookingDto must not be null")
    private BookingDto bookingDto;
}
