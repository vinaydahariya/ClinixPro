package com.clinixPro.controller;

import com.clinixPro.entity.Notification;
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
@RequestMapping("api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final BookingFeignClient bookingFeignClient;
    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(
            @RequestBody Notification notification,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationByUserId(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt
    ) {
        List<NotificationDto> notifications = notificationService.getAllNotificationByUserId(userId);

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

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestHeader("Authorization") String jwt
    ) {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDto> markNotificationAsRead(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        NotificationDto updated = notificationService.markNotificationAsRead(notificationId);

        BookingDto bookingDto = bookingFeignClient.getBookingById(updated.getBookingId()).getBody();
        updated.setBookingDto(bookingDto);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId,
            @RequestHeader("Authorization") String jwt
    ) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<Void> deleteAllNotificationsByUserId(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt
    ) {
        notificationService.deleteAllNotificationsByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}
