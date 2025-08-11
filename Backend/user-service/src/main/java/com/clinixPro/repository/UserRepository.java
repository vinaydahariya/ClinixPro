package com.clinixPro.repository;

import com.clinixPro.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findAll(Pageable pageable);
    boolean existsByEmail(String email);
    boolean existsByPhone(String mobileNumber);
    User findByEmail(String email);
    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))")
    Page<User> searchByFullName(@Param("fullName") String fullName, Pageable pageable);
}
