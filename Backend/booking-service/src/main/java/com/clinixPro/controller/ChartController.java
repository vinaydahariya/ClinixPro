package com.clinixPro.controller;

import com.clinixPro.entity.Booking;
import com.clinixPro.payload.dto.BookingDto;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.service.BookingService;
import com.clinixPro.service.client.ClinicFeignClient;
import com.clinixPro.service.impl.BookingChartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings/chart")
public class ChartController {

    private final BookingChartService bookingChartService;
    private final BookingService bookingService;
    private final ClinicFeignClient clinicService;

    @GetMapping("/earnings")
    public ResponseEntity<List<Map<String, Object>>> getEarningsChartData(
            @RequestHeader("Authorization") String jwt) throws Exception {

        ClinicDto clinic = clinicService.getClinicByOwnerId(jwt).getBody();
        List<BookingDto> bookings = bookingService.getBookingsByClinic(clinic.getId());

        // ✅ Manual mapping to avoid ModelMapper error
        List<Booking> bookings1 = bookings.stream()
                .map(this::convertToBooking)
                .collect(Collectors.toList());

        List<Map<String, Object>> chartData = bookingChartService.generateEarningsChartData(bookings1);

        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Map<String, Object>>> getBookingsChartData(
            @RequestHeader("Authorization") String jwt) throws Exception {

        ClinicDto clinic = clinicService.getClinicByOwnerId(jwt).getBody();
        List<BookingDto> bookings = bookingService.getBookingsByClinic(clinic.getId());

        // ✅ Manual mapping to avoid ModelMapper error
        List<Booking> bookings1 = bookings.stream()
                .map(this::convertToBooking)
                .collect(Collectors.toList());

        List<Map<String, Object>> chartData = bookingChartService.generateBookingCountChartData(bookings1);

        return ResponseEntity.ok(chartData);
    }

    // ✅ Custom mapper method
    private Booking convertToBooking(BookingDto dto) {
        Booking booking = new Booking();
        booking.setId(dto.getId());
        booking.setClinicId(dto.getClinicId());
        booking.setCustomerId(dto.getCustomerId());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setServiceIds(dto.getServiceIds());
        booking.setBookingStatus(dto.getBookingStatus());
        booking.setTotalPrice(dto.getTotalPrice());
        return booking;
    }
}
