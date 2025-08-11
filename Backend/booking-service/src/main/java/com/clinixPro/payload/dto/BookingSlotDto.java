package com.clinixPro.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingSlotDto {

    private Long bookingId;
    private Long clinicId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
