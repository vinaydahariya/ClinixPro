package com.clinixPro.controller;

import com.clinixPro.payload.dto.BookingDto;
import com.clinixPro.payload.dto.NotificationDto;
import com.clinixPro.service.NotificationService;
import com.clinixPro.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class ClinicNotificationController {

    private final NotificationService notificationService;
    private final ModelMapper modelMapper;
    private final BookingFeignClient bookingFeignClient;

    @GetMapping("/clinic/{clinicId}")
    public ResponseEntity<List<NotificationDto>> getNotificationByClinicId(
            @PathVariable Long clinicId,
            @RequestHeader("Authorization") String jwt
    ) {
        List<NotificationDto> notifications = notificationService.getAllNotificationByClinicId(clinicId);

        List<NotificationDto> enrichedNotifications = notifications.stream()
                .map(notification -> {
                    try {
                        BookingDto bookingDto = bookingFeignClient
                                .getBookingById(notification.getBookingId())
                                .getBody();
                        notification.setBookingDto(bookingDto);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to fetch booking for ID: " + notification.getBookingId(), e);
                    }
                    return notification;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(enrichedNotifications);
    }

    // ✅ New Clear All Endpoint for Clinic Owner
    @DeleteMapping("/clinic/{clinicId}/clear")
    public ResponseEntity<Void> deleteAllNotificationsByClinicId(
            @PathVariable Long clinicId,
            @RequestHeader("Authorization") String jwt
    ) {
        notificationService.deleteAllNotificationsByClinicId(clinicId);
        return ResponseEntity.noContent().build();
    }
}
