package com.clinixPro.messaging;

import com.clinixPro.payload.dto.NotificationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sentNotification(Long bookingId,
                                 Long userId,
                                 Long clinicId){
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setBookingId(bookingId);
        notificationDto.setUserId(userId);
        notificationDto.setClinicId(clinicId);
        notificationDto.setDescription("new booking got confirmed");
        notificationDto.setType("BOOKING");
        rabbitTemplate.convertAndSend("notification-queue", notificationDto);
    }



}
