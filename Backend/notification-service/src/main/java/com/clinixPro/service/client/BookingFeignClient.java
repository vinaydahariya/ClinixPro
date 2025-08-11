package com.clinixPro.service.client;

import com.clinixPro.payload.dto.BookingDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("BOOKING-SERVICE")
public interface BookingFeignClient {

    @GetMapping("/api/bookings/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) throws Exception;

}
