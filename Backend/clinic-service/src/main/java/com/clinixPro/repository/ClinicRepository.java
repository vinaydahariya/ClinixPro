package com.clinixPro.repository;

import com.clinixPro.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {

    Clinic findByOwnerId(Long id);

    @Query("SELECT h FROM Clinic h WHERE " +
            "LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(h.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(h.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Clinic> searchClinic(@Param("keyword") String keyword);

    // Check karne ke liye ki email already exist karta hai ya nahi
    boolean existsByEmail(String email);

    // Check karne ke liye ki phone number already exist karta hai ya nahi
    boolean existsByPhoneNumber(String phoneNumber);

}
