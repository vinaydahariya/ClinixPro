package com.clinixPro.scheduler;

import com.clinixPro.entity.Booking;
import com.clinixPro.domain.BookingStatus;
import com.clinixPro.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingStatusScheduler {

    private final BookingRepository bookingRepository;

    // ✅ Run every 1 minute
    @Scheduled(fixedRate = 60000)
    public void autoMarkSuccess() {
        LocalDateTime now = LocalDateTime.now();

        // Fetch only confirmed bookings
        List<Booking> confirmedBookings = bookingRepository.findByBookingStatus(BookingStatus.CONFIRMED);

        for (Booking booking : confirmedBookings) {
            if (booking.getEndTime() != null && booking.getEndTime().isBefore(now)) {
                booking.setBookingStatus(BookingStatus.SUCCESS);
                bookingRepository.save(booking);
            }
        }
    }
}
