package com.clinixPro.payload.request;

import com.clinixPro.domain.PaymentMethod;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingRequest {

    private Long userId;
    private Long clinicId;
    private Long serviceOfferingId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<Long> serviceIds;
    private PaymentMethod paymentMethod = PaymentMethod.STRIPE;

}
