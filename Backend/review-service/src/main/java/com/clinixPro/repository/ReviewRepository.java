package com.clinixPro.repository;

import com.clinixPro.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByClinicId(Long clinicId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.clinicId = :clinicId")
    Double findAverageRatingByClinicId(@Param("clinicId") Long clinicId);

}
