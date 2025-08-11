package com.clinixPro.payload.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDto {

    private Long id;
    private String type;
    private String description;
    private Boolean isRead = false;
    private Long userId;
    private Long bookingId;
    private Long clinicId;
    private LocalDateTime createdAt;
    private BookingDto bookingDto;
}
