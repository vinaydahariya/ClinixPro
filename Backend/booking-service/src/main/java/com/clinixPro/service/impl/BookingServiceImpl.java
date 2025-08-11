package com.clinixPro.service.impl;

import com.clinixPro.domain.BookingStatus;
import com.clinixPro.entity.Booking;
import com.clinixPro.entity.ClinicReport;
import com.clinixPro.exception.BookingException;
import com.clinixPro.payload.dto.*;
import com.clinixPro.payload.request.BookingRequest;
import com.clinixPro.repository.BookingRepository;
import com.clinixPro.service.BookingService;
import com.clinixPro.service.client.ClinicFeignClient;
import com.clinixPro.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;
    private final UserFeignClient userFeignClient;
    private final ClinicFeignClient clinicFeignClient;

    @Override
    @Transactional
    public BookingDto createBooking(UserDto userDto,
                                    ClinicDto clinicDto,
                                    Set<ServiceOfferingDto> serviceOfferingDtos,
                                    BookingRequest bookingRequest) {

        if (serviceOfferingDtos == null || serviceOfferingDtos.isEmpty()) {
            throw new BookingException("Service offerings cannot be null or empty");
        }

        // Total Duration and Price
        int totalDuration = serviceOfferingDtos.stream()
                .mapToInt(so -> so.getDuration() != null ? so.getDuration() : 0)
                .sum();

        int totalPrice = serviceOfferingDtos.stream()
                .mapToInt(so -> so.getPrice() != null ? so.getPrice() : 0)
                .sum();

        // Start and End Time
        LocalDateTime bookingStartTime = bookingRequest.getStartTime();
        LocalDateTime bookingEndTime = bookingStartTime.plusMinutes(totalDuration);

        // Check slot availability
        if (!isTimeSlotAvailable(clinicDto, bookingStartTime, bookingEndTime)) {
            throw new BookingException("Selected time slot is not available.");
        }

        // Prepare Booking
        Set<Long> serviceIds = serviceOfferingDtos.stream()
                .map(ServiceOfferingDto::getId)
                .collect(Collectors.toSet());

        Booking newBooking = new Booking();
        newBooking.setCustomerId(userDto.getId());
        newBooking.setClinicId(clinicDto.getId());
        newBooking.setServiceIds(serviceIds);
        newBooking.setBookingStatus(BookingStatus.PENDING);
        newBooking.setStartTime(bookingStartTime);
        newBooking.setEndTime(bookingEndTime);
        newBooking.setTotalPrice(totalPrice);

        // Save Booking
        Booking savedBooking = bookingRepository.save(newBooking);

        return modelMapper.map(savedBooking, BookingDto.class);
    }

    public boolean isTimeSlotAvailable(ClinicDto clinicDto,
                                       LocalDateTime bookingStartTime,
                                       LocalDateTime bookingEndTime) {
        LocalDate bookingDate = bookingStartTime.toLocalDate();
        if (clinicDto.getOpenTime() == null || clinicDto.getCloseTime() == null) {
            throw new BookingException("Clinic opening or closing time is not set.");
        }

        LocalDateTime clinicOpenTime = clinicDto.getOpenTime().atDate(bookingDate);
        LocalDateTime clinicCloseTime = clinicDto.getCloseTime().atDate(bookingDate);

        if (bookingStartTime.isBefore(clinicOpenTime) || bookingEndTime.isAfter(clinicCloseTime)) {
            throw new BookingException("Booking time must be within clinic's working hours");
        }

        List<BookingDto> existingBookings = getBookingsByClinic(clinicDto.getId()).stream()
                .filter(b -> isSameDate(b.getStartTime(), bookingDate))
                // ✅ Ignore SUCCESS and CANCELLED bookings
                .filter(b -> b.getBookingStatus() != BookingStatus.SUCCESS &&
                        b.getBookingStatus() != BookingStatus.CANCELLED)
                .collect(Collectors.toList());

        for (BookingDto existingBooking : existingBookings) {
            LocalDateTime existingStart = existingBooking.getStartTime();
            LocalDateTime existingEnd = existingBooking.getEndTime();

            boolean overlap = bookingStartTime.isBefore(existingEnd) && bookingEndTime.isAfter(existingStart);
            if (overlap) {
                return false;
            }
        }

        return true;
    }


    @Override
    public List<BookingDto> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId).stream()
                .map(b -> modelMapper.map(b, BookingDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDto> getBookingsByClinic(Long clinicId) {
        return bookingRepository.findByClinicId(clinicId).stream()
                .map(b -> modelMapper.map(b, BookingDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public BookingDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking not found with id: " + id));
        return modelMapper.map(booking, BookingDto.class);
    }

    @Override
    public BookingDto updateBooking(Long bookingId, BookingStatus bookingStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingException("Booking not found"));
        booking.setBookingStatus(bookingStatus);
        Booking updatedBooking = bookingRepository.save(booking);
        return modelMapper.map(updatedBooking, BookingDto.class);
    }

    @Override
    public List<BookingDto> getBookingsByDate(LocalDate date, Long clinicId) {
        List<Booking> bookings = bookingRepository.findByClinicId(clinicId);
        return bookings.stream()
                .filter(b -> isSameDate(b.getStartTime(), date) || isSameDate(b.getEndTime(), date))
                .map(b -> modelMapper.map(b, BookingDto.class))
                .collect(Collectors.toList());
    }

    private boolean isSameDate(LocalDateTime dateTime, LocalDate date) {
        return dateTime.toLocalDate().isEqual(date);
    }

    @Override
    public ClinicReport getClinicReport(Long clinicId) {
        List<BookingDto> bookings = getBookingsByClinic(clinicId);

        int totalEarnings = bookings.stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.SUCCESS)
                .mapToInt(BookingDto::getTotalPrice)
                .sum();

        int totalBookings = bookings.size();

        long cancelledCount = bookings.stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.CANCELLED)
                .count();

        double totalRefund = bookings.stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.CANCELLED)
                .mapToDouble(BookingDto::getTotalPrice)
                .sum();


        ClinicReport report = new ClinicReport();
        report.setClinicId(clinicId);
        report.setTotalBookings(totalBookings);
        report.setCancelledBookings((int) cancelledCount);
        report.setTotalEarnings(totalEarnings);
        report.setTotalRefund(totalRefund);

        return report;
    }

    @Override
    public Booking bookingSuccess(PaymentOrderDto paymentOrderDto) {
        Booking booking = bookingRepository.findById(paymentOrderDto.getBookingId())
                .orElseThrow(() -> new BookingException("Booking not found"));

        booking.setBookingStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    @Override
    public BookingDto updateBookingSlot(Long bookingId,
                                        Set<ServiceOfferingDto> serviceOfferingDtos,
                                        BookingRequest bookingRequest) throws Exception {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingException("Booking not found with id: " + bookingId));

        if (serviceOfferingDtos == null || serviceOfferingDtos.isEmpty()) {
            throw new BookingException("Service offerings cannot be null or empty");
        }

        // ✅ Calculate total duration
        int totalDuration = serviceOfferingDtos.stream()
                .mapToInt(so -> so.getDuration() != null ? so.getDuration() : 0)
                .sum();

        // ✅ Start & End time
        LocalDateTime startTime = bookingRequest.getStartTime();
        LocalDateTime endTime = startTime.plusMinutes(totalDuration);

        // ✅ Collect service IDs
        Set<Long> serviceIds = serviceOfferingDtos.stream()
                .map(ServiceOfferingDto::getId)
                .collect(Collectors.toSet());

        // ✅ Prepare ClinicDto
        ClinicDto clinicDto = new ClinicDto();
        clinicDto.setId(booking.getClinicId());

        // ✅ Check slot availability excluding current booking
        boolean slotAvailable = isTimeSlotAvailableExcludeCurrent(clinicDto, startTime, endTime, bookingId);

        if (!slotAvailable) {
            throw new BookingException("Selected slot is not available.");
        }

        // ✅ Update booking
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setServiceIds(serviceIds);

        Booking updatedBooking = bookingRepository.save(booking);
        return modelMapper.map(updatedBooking, BookingDto.class);
    }

    @Override
    public BookingDto markBookingAsSuccess(Long bookingId, Long clinicId) throws Exception {
        // ✅ Fetch booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new Exception("Booking not found"));

        // ✅ Validate clinic owner
        if (!booking.getClinicId().equals(clinicId)) {
            throw new Exception("You are not authorized to mark this booking as SUCCESS");
        }

        // ✅ Allow only confirmed bookings
        if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            throw new Exception("Only CONFIRMED bookings can be marked as SUCCESS");
        }

        // ✅ Update status
        booking.setBookingStatus(BookingStatus.SUCCESS);
        bookingRepository.save(booking);

        return modelMapper.map(booking, BookingDto.class);
    }

    @Override
    public Page<BookingDto> getAllBookings(Pageable pageable) {
        Page<Booking> bookings = bookingRepository.findAll(pageable);

        return bookings.map(booking -> {
            BookingDto dto = modelMapper.map(booking, BookingDto.class);

            // --- Fetch & set customer (UserDto) safely ---
            try {
                // OPTION A: if your Feign returns UserDto directly
                UserDto user = userFeignClient.getUserById(booking.getCustomerId()).getBody();
                if (user != null) {
                    dto.setUserDto(user);
                }

                // OPTION B: if your Feign returns ResponseEntity<UserDto>
                // ResponseEntity<UserDto> userResp = userFeignClient.getUserByIdResponse(booking.getCustomerId());
                // if (userResp != null && userResp.getBody() != null) {
                //     dto.setUserDto(userResp.getBody());
                // }
            } catch (Exception e) {
                // safe fallback — don't break whole mapping if feign call fails
                // logger.warn("User fetch failed for id " + booking.getCustomerId(), e);
            }

            // --- Fetch & set clinic (ClinicDto) safely ---
            try {
                // OPTION A: if Feign returns ClinicDto directly
                ClinicDto clinic = clinicFeignClient.getClinicById(booking.getClinicId()).getBody();
                if (clinic != null) {
                    dto.setClinic(clinic);
                }

                // OPTION B: if Feign returns ResponseEntity<ClinicDto>
                // ResponseEntity<ClinicDto> clinicResp = clinicFeignClient.getClinicByIdResponse(booking.getClinicId());
                // if (clinicResp != null && clinicResp.getBody() != null) {
                //     dto.setClinic(clinicResp.getBody());
                // }
            } catch (Exception e) {
                // logger.warn("Clinic fetch failed for id " + booking.getClinicId(), e);
            }

            // (Optional) fetch services DTOs if you need them here
            // try { ... }

            return dto;
        });
    }



    @Override
    public List<BookingChartDto> getBookingChart(LocalDateTime start, LocalDateTime end) {
        List<Booking> bookings = bookingRepository.findByStartTimeBetween(start, end);

        // Group by date and count bookings per day
        Map<LocalDate, Long> bookingCountByDate = bookings.stream()
                .collect(Collectors.groupingBy(
                        booking -> booking.getStartTime().toLocalDate(),
                        Collectors.counting()
                ));

        // Convert map entries to list of DTOs sorted by date ascending
        List<BookingChartDto> bookingChart = bookingCountByDate.entrySet().stream()
                .map(entry -> new BookingChartDto(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(BookingChartDto::getBookingDate))
                .collect(Collectors.toList());

        return bookingChart;
    }


    private boolean isTimeSlotAvailableExcludeCurrent(ClinicDto clinicDto,
                                                      LocalDateTime bookingStartTime,
                                                      LocalDateTime bookingEndTime,
                                                      Long currentBookingId) {

        List<Booking> existingBookings = bookingRepository.findByClinicId(clinicDto.getId());

        return existingBookings.stream()
                .filter(b -> !b.getId().equals(currentBookingId))
                // ✅ Ignore SUCCESS and CANCELLED bookings
                .filter(b -> b.getBookingStatus() != BookingStatus.SUCCESS &&
                        b.getBookingStatus() != BookingStatus.CANCELLED)
                .noneMatch(b ->
                        bookingStartTime.isBefore(b.getEndTime()) &&
                                bookingEndTime.isAfter(b.getStartTime())
                );
    }


    @Override
    public List<BookingDto> searchBookingByUserName(String jwt, String fullName, int page, int size) throws Exception {
        // 1. User service se users search karo with pagination
        Map<String, Object> userResponse = userFeignClient.searchUsers(jwt, fullName, page, size).getBody();

        if (userResponse == null || !userResponse.containsKey("content")) {
            return Collections.emptyList();
        }

        List<?> userListRaw = (List<?>) userResponse.get("content");
        if (userListRaw.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. UserDto list banayenge (typecast carefully)
        List<UserDto> users = userListRaw.stream()
                .map(obj -> {
                    // Assuming obj is LinkedHashMap, convert to UserDto
                    Map<String, Object> map = (Map<String, Object>) obj;
                    UserDto userDto = new UserDto();
                    userDto.setId(Long.valueOf(map.get("id").toString()));
                    userDto.setFullName(map.get("fullName").toString());
                    // add other needed fields if required
                    return userDto;
                })
                .collect(Collectors.toList());

        // 3. User Ids nikal lo
        List<Long> userIds = users.stream()
                .map(UserDto::getId)
                .collect(Collectors.toList());

        if(userIds.isEmpty()) return Collections.emptyList();

        // 4. Booking fetch karo userIds se
        List<Booking> bookings = bookingRepository.findByCustomerIdIn(userIds);

        // 5. BookingDto me map karo and return karo
        return bookings.stream()
                .map(booking -> modelMapper.map(booking, BookingDto.class))
                .collect(Collectors.toList());
    }


    @Override
    public void deleteBooking(Long bookingId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new Exception("Booking not found with id: " + bookingId));

        bookingRepository.delete(booking);
    }

    @Override
    public List<BookingDto> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                .map(booking -> modelMapper.map(booking, BookingDto.class))
                .collect(Collectors.toList());
    }

}
