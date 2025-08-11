package com.clinixPro.messaging;

import com.clinixPro.payload.dto.PaymentOrderDto;
import com.clinixPro.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class BookingEventConsumer {

    private final BookingService bookingService;

    @RabbitListener(queues = "booking-queue")
    public void bookingUpdateListener(PaymentOrderDto paymentOrderDto) {
        try {
            bookingService.bookingSuccess(paymentOrderDto);
        } catch (Exception e) {
            System.err.println("❌ Error in bookingUpdateListener: " + e.getMessage());
            throw e; // Message will now go to DLQ
        }
    }


}
