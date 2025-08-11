package com.clinixPro.service.impl;


import com.clinixPro.payload.dto.NotificationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;


@Controller
@RequiredArgsConstructor
public class RealTimeCommunicationService {


    private final SimpMessagingTemplate simpMessagingTemplate;



    public void sendNotification(NotificationDto notification) {
        simpMessagingTemplate.convertAndSend(
                "/notification/user/"+notification.getUserId(),
                notification
        );
        simpMessagingTemplate.convertAndSend(
                "/notification/clinic/"+notification.getClinicId(),
                notification
        );
    }



}