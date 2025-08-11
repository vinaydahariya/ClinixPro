package com.clinixPro.service.impl;

import com.clinixPro.entity.Notification;
import com.clinixPro.payload.dto.BookingDto;
import com.clinixPro.payload.dto.NotificationDto;
import com.clinixPro.repository.NotificationRepository;
import com.clinixPro.service.NotificationService;
import com.clinixPro.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final ModelMapper modelMapper;
    private final BookingFeignClient bookingFeignClient;

    @Override
    public NotificationDto createNotification(Notification notification) throws Exception {
        Notification savedNotification = notificationRepository.save(notification);
        BookingDto bookingDto = bookingFeignClient.getBookingById(savedNotification.getBookingId()).getBody();
        NotificationDto notificationDto = modelMapper.map(savedNotification, NotificationDto.class);
        return notificationDto;
    }

    @Override
    public List<NotificationDto> getAllNotificationByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        return notifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> getAllNotificationByClinicId(Long clinicId) {
        List<Notification> notifications = notificationRepository.findByClinicId(clinicId);
        return notifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public NotificationDto markNotificationAsRead(Long notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notification.setIsRead(true);  // assuming you have a `read` field in your Notification entity
            Notification updated = notificationRepository.save(notification);
            return modelMapper.map(updated, NotificationDto.class);
        } else {
            throw new RuntimeException("Notification not found with ID: " + notificationId);
        }
    }

    @Override
    public void deleteNotification(Long notificationId) {
        if (notificationRepository.existsById(notificationId)) {
            notificationRepository.deleteById(notificationId);
        } else {
            throw new RuntimeException("Notification not found");
        }
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }



    @Override
    public void deleteAllNotificationsByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        if (notifications.isEmpty()) {
            throw new RuntimeException("No notifications found for this user");
        }
        notificationRepository.deleteAll(notifications);
    }

    @Override
    public void deleteAllNotificationsByClinicId(Long clinicId) {
        List<Notification> notifications = notificationRepository.findByClinicId(clinicId);
        if (notifications.isEmpty()) {
            throw new RuntimeException("No notifications found for this clinic");
        }
        notificationRepository.deleteAll(notifications);
    }


}
