package com.clinixPro.payload.dto;

import com.clinixPro.domain.BookingStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingDto {

    private Long id;
    private Long clinicId;
    private Long customerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<Long> serviceIds;
    private BookingStatus bookingStatus = BookingStatus.PENDING;
    private int totalPrice;
}
