package com.clinixPro.entity;


import com.clinixPro.domain.PaymentMethod;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentOrder {

    private Long id;
    private Long amount;
    private PaymentMethod paymentMethod;
    private String paymentLinkId;
    private Long userId;

    private Long bookingId;

    private Long salonId;
}
