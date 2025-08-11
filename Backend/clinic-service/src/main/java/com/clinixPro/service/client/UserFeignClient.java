package com.clinixPro.service.client;

import com.clinixPro.payload.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient("USER-SERVICE")
public interface UserFeignClient {

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<UserDto> getUserById(
            @PathVariable("userId") Long userId) throws Exception;

    @GetMapping("/api/users/profile")
    public ResponseEntity<UserDto> getUserProfile(
            @RequestHeader("Authorization") String jwt) throws Exception;

    @PutMapping("api/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role,
            @RequestHeader("Authorization") String jwt) throws Exception;

    @GetMapping("api/users/{userId}/role")
    public ResponseEntity<String> getUserRole(
            @PathVariable Long userId,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception;

}
