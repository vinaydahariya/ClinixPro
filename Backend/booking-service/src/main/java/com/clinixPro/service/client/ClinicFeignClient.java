package com.clinixPro.service.client;

import com.clinixPro.payload.dto.ClinicDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient("CLINIC-SERVICE")
public interface ClinicFeignClient {

    @GetMapping("/api/clinics/owner")
    public ResponseEntity<ClinicDto> getClinicByOwnerId(
            @RequestHeader("Authorization") String jwt
    ) throws Exception;

    @GetMapping("/api/clinics/{clinicId}")
    public ResponseEntity<ClinicDto> getClinicById(
            @PathVariable Long clinicId
    ) throws Exception;

}
