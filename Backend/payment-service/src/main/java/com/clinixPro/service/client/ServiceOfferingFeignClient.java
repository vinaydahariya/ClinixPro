package com.clinixPro.service.client;

import com.clinixPro.payload.dto.ServiceOfferingDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Set;

@FeignClient("SERVICE-OFFERING-SERVICE")
public interface ServiceOfferingFeignClient {

    @GetMapping("/api/service-offering/list/{ids}")
    public ResponseEntity<Set<ServiceOfferingDto>> getServicesByIds(
            @PathVariable Set<Long> ids);

}
