package com.clinixPro.controller;

import com.clinixPro.domain.BookingStatus;
import com.clinixPro.entity.ClinicReport;
import com.clinixPro.domain.PaymentMethod;
import com.clinixPro.payload.dto.*;
import com.clinixPro.payload.request.BookingRequest;
import com.clinixPro.payload.response.PaymentLinkResponse;
import com.clinixPro.service.BookingService;
import com.clinixPro.service.client.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final ModelMapper modelMapper;
    private final BookingService bookingService;
    private final ClinicFeignClient clinicFeignClient;
    private final UserFeignClient userFeignClient;
    private final ServiceOfferingFeignClient serviceOfferingFeignClient;
    private final PaymentFeignClient paymentFeignClient;
    private final CategoryFeignClient categoryFeignClient;

    @PostMapping
    public ResponseEntity<PaymentLinkResponse> createBooking(
            @RequestParam("clinicId") Long clinicId,
            @RequestParam PaymentMethod paymentMethod,
            @RequestBody BookingRequest bookingRequest,
            @RequestHeader("Authorization") String jwt) throws Exception {


        // Build UserDto
        UserDto userDto = userFeignClient.getUserProfile(jwt).getBody();

        // Mock ClinicDto (temporary)
        ClinicDto clinicDto = clinicFeignClient.getClinicById(clinicId).getBody();

        Set<ServiceOfferingDto> serviceOfferingDtos = serviceOfferingFeignClient.getServicesByIds(
                bookingRequest.getServiceIds()).getBody();

        BookingDto booking = bookingService.createBooking(userDto, clinicDto, serviceOfferingDtos, bookingRequest);
        BookingDto bookingDto = modelMapper.map(booking, BookingDto.class);
        PaymentLinkResponse paymentLinkResponse = paymentFeignClient.createPaymentLink(
                bookingDto,
                paymentMethod,
                jwt
        ).getBody();

        return ResponseEntity.ok(paymentLinkResponse);
    }

    @PutMapping("/{bookingId}/update-slot")
    public ResponseEntity<BookingDto> updateBookingSlot(
            @PathVariable Long bookingId,
            @RequestBody BookingRequest bookingRequest,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        // Service IDs se DTOs fetch karo
        Set<ServiceOfferingDto> serviceOfferingDtos = serviceOfferingFeignClient
                .getServicesByIds(bookingRequest.getServiceIds())
                .getBody();

        BookingDto updatedBooking = bookingService.updateBookingSlot(
                bookingId,
                serviceOfferingDtos,
                bookingRequest
        );

        return ResponseEntity.ok(updatedBooking);
    }




    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) throws Exception {
        BookingDto booking = bookingService.getBookingById(id);
        Set<ServiceOfferingDto> serviceOfferingDtos = serviceOfferingFeignClient
                .getServicesByIds(booking.getServiceIds()).getBody();
        return ResponseEntity.ok(booking);
    }


    @GetMapping("/customer")
    public ResponseEntity<List<BookingDto>> getBookingsByCustomer(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDto userDto = userFeignClient.getUserProfile(jwt).getBody();
        if (userDto == null || userDto.getId() == null) {
            throw new Exception("user not found from jwt.......");
        }

        List<BookingDto> bookings = bookingService.getBookingsByCustomer(userDto.getId());

        for (BookingDto booking : bookings) {
            // Fetch clinic info
            booking.setClinic(clinicFeignClient.getClinicById(booking.getClinicId()).getBody());

            // Fetch services
            Set<ServiceOfferingDto> services = serviceOfferingFeignClient
                    .getServicesByIds(booking.getServiceIds())
                    .getBody();

            // Fetch category for each service
            for (ServiceOfferingDto service : services) {
                if (service.getCategoryId() != null) {
                    CategoryDto category = categoryFeignClient.getCategoryById(service.getCategoryId()).getBody();
                    service.setCategoryDto(category); // Add category object inside service
                }
            }

            booking.setServices(services);
        }

        return ResponseEntity.ok(bookings);
    }


    @GetMapping("/clinic")
    public ResponseEntity<List<BookingDto>> getBookingsByClinic(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        ClinicDto clinicDto = clinicFeignClient.getClinicByOwnerId(jwt).getBody();
        List<BookingDto> bookings = bookingService.getBookingsByClinic(clinicDto.getId());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/clinic/{clinicId}/date")
    public ResponseEntity<List<BookingDto>> getBookingsByDate(
            @PathVariable Long clinicId,
            @RequestParam(required = false) LocalDate date
    ) {
        List<BookingDto> bookings = bookingService.getBookingsByDate(date, clinicId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingDto> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status
    ) throws Exception {
        BookingDto updatedBooking = bookingService.updateBooking(bookingId, status);
        return ResponseEntity.ok(updatedBooking);
    }

    @GetMapping("/clinic/{clinicId}/report")
    public ResponseEntity<ClinicReport> getClinicReport(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        ClinicDto clinicDto = clinicFeignClient.getClinicByOwnerId(jwt).getBody();
        ClinicReport report = bookingService.getClinicReport(clinicDto.getId());
        return ResponseEntity.ok(report);
    }

    @GetMapping("/slots/clinic/{clinicId}")
    public ResponseEntity<List<BookingSlotDto>> getBookedSlots(
            @PathVariable Long clinicId,
            @RequestParam("date") LocalDate date
    ) throws Exception {
        List<BookingSlotDto> bookings = bookingService.getBookingsByDate(date, clinicId)
                .stream()
                .map(b -> new BookingSlotDto(
                        b.getId(),
                        b.getClinicId(),
                        b.getStartTime(),
                        b.getEndTime()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookings);
    }


    @PutMapping("/{bookingId}/success")
    public ResponseEntity<BookingDto> markBookingSuccess(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        // Clinic ka owner id fetch karo
        ClinicDto clinicDto = clinicFeignClient.getClinicByOwnerId(jwt).getBody();

        // Booking ko success mark karne ke liye service call
        BookingDto updatedBooking = bookingService.markBookingAsSuccess(bookingId, clinicDto.getId());

        return ResponseEntity.ok(updatedBooking);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        // ✅ JWT se user info nikal
        var currentUser = userFeignClient.getUserProfile(jwt).getBody();

        // ✅ Check admin
        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Pageable pageable = (Pageable) PageRequest.of(page, size, Sort.by(sortBy));
        Page<BookingDto> bookingPage = bookingService.getAllBookings(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", bookingPage.getContent());
        response.put("currentPage", bookingPage.getNumber());
        response.put("totalItems", bookingPage.getTotalElements());
        response.put("totalPages", bookingPage.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Admin: Get booking chart (daily booking counts)
    @GetMapping("/chart")
    public ResponseEntity<List<BookingChartDto>> getBookingChart(@RequestParam(required = false) String startDate,
                                                                 @RequestParam(required = false) String endDate,
                                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        var currentUser = userFeignClient.getUserProfile(jwt).getBody();

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        LocalDateTime start = (startDate != null) ? LocalDate.parse(startDate).atStartOfDay()
                : LocalDate.now().minusMonths(1).atStartOfDay();

        LocalDateTime end = (endDate != null) ? LocalDate.parse(endDate).atTime(LocalTime.MAX)
                : LocalDate.now().atTime(LocalTime.MAX);

        List<BookingChartDto> chartData = bookingService.getBookingChart(start, end);

        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookingDto>> searchBookingByUserName(
            @RequestParam("fullName") String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        var currentUser = userFeignClient.getUserProfile(jwt).getBody();
        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<BookingDto> bookings = bookingService.searchBookingByUserName(jwt, fullName, page, size);
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long bookingId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        // ✅ JWT se current user ka role check
        var currentUser = userFeignClient.getUserProfile(jwt).getBody();

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        bookingService.deleteBooking(bookingId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookingDto>> getAllBookingsNoPagination(
            @RequestHeader("Authorization") String jwt) throws Exception {

        // Feign client se user ka profile fetch karo
        UserDto currentUser = userFeignClient.getUserProfile(jwt).getBody();

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<BookingDto> allBookings = bookingService.getAllBookings(); // without pagination
        return ResponseEntity.ok(allBookings);
    }



}
