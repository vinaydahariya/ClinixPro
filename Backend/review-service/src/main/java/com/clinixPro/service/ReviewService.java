package com.clinixPro.service;

import com.clinixPro.entity.Review;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.UserDTO;
import com.clinixPro.payload.request.ReviewRequest;
import com.clinixPro.payload.response.ReviewResponseDto;

import java.util.List;

public interface ReviewService {

    Review createReview(
            ReviewRequest reviewRequest,
            UserDTO userDTO,
            ClinicDto clinicDto
    );

    List<ReviewResponseDto> getReviewsByClinicId(Long clinicId);

    Review updateReview(ReviewRequest reviewRequest, Long reviewId, Long userId) throws Exception;

    void deleteReview(Long reviewId, Long userId) throws Exception;



}
