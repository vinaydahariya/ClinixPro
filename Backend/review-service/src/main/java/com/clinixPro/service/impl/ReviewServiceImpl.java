package com.clinixPro.service.impl;

import com.clinixPro.entity.Review;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.UserDTO;
import com.clinixPro.payload.request.ReviewRequest;
import com.clinixPro.payload.response.ReviewResponseDto;
import com.clinixPro.repository.ReviewRepository;
import com.clinixPro.service.ReviewService;
import com.clinixPro.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ModelMapper modelMapper;
    private final UserFeignClient userFeignClient;
    @Override
    public Review createReview(ReviewRequest reviewRequest, UserDTO userDTO, ClinicDto clinicDto) {
        Review review = new Review();
        review.setReviewText(reviewRequest.getReviewText());
        review.setRating(reviewRequest.getRating());
        review.setUserId(userDTO.getId());
        review.setClinicId(clinicDto.getId());
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public List<ReviewResponseDto> getReviewsByClinicId(Long clinicId) {
        List<Review> reviews = reviewRepository.findByClinicId(clinicId);
        List<ReviewResponseDto> responseList = new ArrayList<>();

        for (Review review : reviews) {
            ReviewResponseDto dto = new ReviewResponseDto();

            dto.setId(review.getId());
            dto.setReviewText(review.getReviewText());
            dto.setRating(review.getRating());
            dto.setClinicId(review.getClinicId());
            dto.setUserId(review.getUserId());
            dto.setCreatedAt(review.getCreatedAt().toString());

            try {
                // ✅ Feign client call to USER-SERVICE
                ResponseEntity<UserDTO> userResponse = userFeignClient.getUserById(review.getUserId());
                if (userResponse.getBody() != null) {
                    dto.setUserName(userResponse.getBody().getFullName());
                    dto.setUserImage(userResponse.getBody().getImage());
                }
            } catch (Exception e) {
                dto.setUserName("Unknown User");
                dto.setUserImage(null);
            }

            responseList.add(dto);
        }

        return responseList;
    }


    private Review getReviewById(Long id) throws Exception {
        return reviewRepository.findById(id).orElseThrow(
                ()-> new Exception("review not exist........")
        );
    }

    @Override
    public Review updateReview(ReviewRequest reviewRequest, Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if (!review.getUserId().equals(userId)){
            throw new Exception("you don't have permission to update this review");
        }
        review.setReviewText(reviewRequest.getReviewText());
        review.setRating(reviewRequest.getRating());
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review = getReviewById(reviewId);
        if (!review.getUserId().equals(userId)){
            throw new Exception("you don't have permission to delete this review");
        }
        reviewRepository.delete(review);
    }


}
