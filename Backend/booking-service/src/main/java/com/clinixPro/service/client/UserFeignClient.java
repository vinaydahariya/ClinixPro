package com.clinixPro.service.client;

import com.clinixPro.payload.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient("USER-SERVICE")
public interface UserFeignClient {

    @GetMapping("/api/users/{userId}")
    public ResponseEntity<UserDto> getUserById(
            @PathVariable("userId") Long userId) throws Exception;

    @GetMapping("/api/users/profile")
    public ResponseEntity<UserDto> getUserProfile(
            @RequestHeader("Authorization") String jwt) throws Exception;

    @GetMapping("/api/users/search")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @RequestHeader("Authorization") String jwt,
            @RequestParam String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size);
}
