package com.clinixPro.service.client;

import com.clinixPro.domain.PaymentMethod;
import com.clinixPro.payload.dto.BookingDto;
import com.clinixPro.payload.response.PaymentLinkResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("PAYMENT-SERVICE")
public interface PaymentFeignClient {

    @PostMapping("/api/payments/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestBody BookingDto bookingDto,
            @RequestParam PaymentMethod paymentMethod,
            @RequestHeader("Authorization") String jwt
    );

}
