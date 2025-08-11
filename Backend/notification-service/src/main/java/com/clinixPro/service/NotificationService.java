package com.clinixPro.service;

import com.clinixPro.entity.Notification;
import com.clinixPro.payload.dto.NotificationDto;

import java.util.List;

public interface NotificationService {

    NotificationDto createNotification(Notification notification) throws Exception;
    List<NotificationDto> getAllNotificationByUserId(Long userId);
    List<NotificationDto> getAllNotificationByClinicId(Long clinicId);
    NotificationDto markNotificationAsRead(Long notificationId);
    void deleteNotification(Long notificationId);
    List<Notification> getAllNotifications();

    void deleteAllNotificationsByUserId(Long userId);
    void deleteAllNotificationsByClinicId(Long clinicId);
}
