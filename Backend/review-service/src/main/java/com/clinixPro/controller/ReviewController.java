package com.clinixPro.controller;

import com.clinixPro.entity.Review;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.UserDTO;
import com.clinixPro.payload.request.ReviewRequest;
import com.clinixPro.payload.response.ApiResponse;
import com.clinixPro.payload.response.ReviewResponseDto;
import com.clinixPro.service.ReviewService;
import com.clinixPro.service.client.ClinicFeignClient;
import com.clinixPro.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserFeignClient userFeignClient;
    private final ClinicFeignClient clinicFeignClient;
    private final ModelMapper modelMapper;

    @PostMapping("/clinic/{clinicId}")
    public ResponseEntity<Review> createReview(
            @PathVariable Long clinicId,
            @RequestBody ReviewRequest reviewRequest,
            @RequestHeader("Authorization") String jwt
            ) throws Exception {
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();
        ClinicDto clinicDto = clinicFeignClient.getClinicById(clinicId).getBody();
        Review reviews = reviewService.createReview(reviewRequest, userDTO, clinicDto);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/clinic/{clinicId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByClinic(@PathVariable Long clinicId) {
        return ResponseEntity.ok(reviewService.getReviewsByClinicId(clinicId));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest reviewRequest,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();
        Review reviews = reviewService.updateReview(
                reviewRequest,
                reviewId,
                userDTO.getId()
        );
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO userDTO = userFeignClient.getUserProfile(jwt).getBody();
        reviewService.deleteReview(reviewId, userDTO.getId());
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Review delete");
        return ResponseEntity.ok(apiResponse);
    }



}
