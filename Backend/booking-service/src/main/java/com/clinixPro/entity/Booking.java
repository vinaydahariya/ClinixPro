package com.clinixPro.entity;

import com.clinixPro.domain.BookingStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long clinicId;

    private Long customerId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @ElementCollection
    private Set<Long> serviceIds;

    private BookingStatus bookingStatus = BookingStatus.PENDING;

    private int totalPrice;

    private LocalDateTime createdAt = LocalDateTime.now();

}
