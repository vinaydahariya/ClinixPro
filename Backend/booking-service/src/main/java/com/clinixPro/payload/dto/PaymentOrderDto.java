package com.clinixPro.payload.dto;

import com.clinixPro.domain.PaymentMethod;
import lombok.Data;

@Data
public class PaymentOrderDto {

    private Long id;

    private Long amount;

    private PaymentMethod paymentMethod;

    private String paymentLinkId;

    private Long userId;

    private Long bookingId;

    private Long clinicId;

}
