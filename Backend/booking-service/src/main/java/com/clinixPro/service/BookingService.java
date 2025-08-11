package com.clinixPro.service;

import com.clinixPro.domain.BookingStatus;
import com.clinixPro.entity.Booking;
import com.clinixPro.entity.ClinicReport;
import com.clinixPro.payload.dto.*;
import com.clinixPro.payload.request.BookingRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface BookingService {
    BookingDto createBooking(UserDto userDto, ClinicDto clinicDto,
                             Set<ServiceOfferingDto> serviceOfferingDtos,
                             BookingRequest bookingRequest) throws Exception;

    List<BookingDto> getBookingsByCustomer(Long customerId);
    List<BookingDto> getBookingsByClinic(Long clinicId);
    BookingDto getBookingById(Long id) throws Exception;
    BookingDto updateBooking(Long bookingId, BookingStatus bookingStatus) throws Exception;
    List<BookingDto> getBookingsByDate(LocalDate date, Long clinicId);
    ClinicReport getClinicReport(Long clinicId);
    Booking bookingSuccess(PaymentOrderDto paymentOrderDto);
    public BookingDto updateBookingSlot(Long bookingId,
                                        Set<ServiceOfferingDto> serviceOfferingDtos,
                                        BookingRequest bookingRequest) throws Exception;

    BookingDto markBookingAsSuccess(Long bookingId, Long clinicId) throws Exception;
    Page<BookingDto> getAllBookings(Pageable pageable);
    List<BookingDto> getAllBookings();

    List<BookingChartDto> getBookingChart(LocalDateTime start, LocalDateTime end);
    List<BookingDto> searchBookingByUserName(String jwt, String fullName, int page, int size) throws Exception;
    void deleteBooking(Long bookingId) throws Exception;


}
