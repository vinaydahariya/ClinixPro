package com.clinixPro.messaging;

import com.clinixPro.domain.BookingStatus;
import com.clinixPro.payload.dto.NotificationDto;
import com.clinixPro.service.client.ClinicFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventProducer {

    private final RabbitTemplate rabbitTemplate;
    private final ClinicFeignClient clinicFeignClient;

    public void sendNotification(Long bookingId,
                                 Long userId,
                                 Long clinicId,
                                 BookingStatus status) {

        // 🔒 Only CONFIRMED and REFUNDED handled in payment-service
        if (status != BookingStatus.CONFIRMED && status != BookingStatus.REFUNDED) {
            return;
        }

        String customerMsg = getCustomerMessage(status);
        String ownerMsg = getOwnerMessage(status);

        // Customer notification
        NotificationDto customerNotification = new NotificationDto();
        customerNotification.setBookingId(bookingId);
        customerNotification.setUserId(userId);
        customerNotification.setClinicId(clinicId);
        customerNotification.setDescription(customerMsg);
        customerNotification.setType("BOOKING_" + status.name());
        rabbitTemplate.convertAndSend("notification-queue", customerNotification);

        // Fetch clinic owner
        Long clinicOwnerId = null;
        try {
            var clinicResponse = clinicFeignClient.getClinicById(clinicId);
            if (clinicResponse != null && clinicResponse.getBody() != null) {
                clinicOwnerId = clinicResponse.getBody().getOwnerId();
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to fetch clinic ownerId for clinicId: " + clinicId);
            e.printStackTrace();
        }

        // Owner notification
        if (clinicOwnerId != null) {
            NotificationDto ownerNotification = new NotificationDto();
            ownerNotification.setBookingId(bookingId);
            ownerNotification.setUserId(clinicOwnerId);
            ownerNotification.setClinicId(clinicId);
            ownerNotification.setDescription(ownerMsg + " (Booking " + bookingId + ")");
            ownerNotification.setType("BOOKING_" + status.name());
            rabbitTemplate.convertAndSend("notification-queue", ownerNotification);
        }
    }

    private String getCustomerMessage(BookingStatus status) {
        return switch (status) {
            case CONFIRMED -> "Your booking is confirmed!";
            case REFUNDED -> "Your booking has been refunded.";
            default -> "";
        };
    }

    private String getOwnerMessage(BookingStatus status) {
        return switch (status) {
            case CONFIRMED -> "A booking has been confirmed in your clinic.";
            case REFUNDED -> "A booking has been refunded.";
            default -> "";
        };
    }
}
