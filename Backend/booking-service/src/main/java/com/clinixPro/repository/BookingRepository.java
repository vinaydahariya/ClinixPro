package com.clinixPro.repository;

import com.clinixPro.domain.BookingStatus;
import com.clinixPro.entity.Booking;
import com.clinixPro.payload.dto.BookingChartDto;
import com.clinixPro.payload.dto.BookingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByClinicId(Long clinicId);

    List<Booking> findByBookingStatus(BookingStatus bookingStatus);
    Page<Booking> findAll(Pageable pageable);

    // Group bookings by date (startTime's date part), count bookings per day in given range
    List<Booking> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Booking> findByCustomerIdIn(List<Long> customerIds);
}
