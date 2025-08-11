package com.clinixPro.controller;

import com.clinixPro.entity.ServiceOffering;
import com.clinixPro.payload.dto.CategoryDto;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.ServiceOfferingDto;
import com.clinixPro.service.ServiceOfferingService;
import com.clinixPro.service.client.CategoryFeignClient;
import com.clinixPro.service.client.ClinicFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service-offering/clinic-owner")
@RequiredArgsConstructor
public class ClinicServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;
    private final ClinicFeignClient clinicFeignClient;
    private final CategoryFeignClient categoryFeignClient;

    @PostMapping
    public ResponseEntity<ServiceOffering> createService(
            @RequestBody ServiceOfferingDto serviceOfferingDto,
            @RequestHeader("Authorization") String jwt) throws Exception {
        ClinicDto clinicDto = clinicFeignClient.getClinicByOwnerId(jwt).getBody();

        CategoryDto categoryDto = categoryFeignClient.getCategoriesByIdClinic(
                clinicDto.getId(), serviceOfferingDto.getCategoryId()).getBody();

        ServiceOffering service = serviceOfferingService.createService(
                clinicDto, serviceOfferingDto, categoryDto);
        return new ResponseEntity<>(service, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceOffering> updateService(
            @PathVariable Long id,
            @RequestBody ServiceOffering serviceOffering) throws Exception{
        try {
            ServiceOffering updatedService = serviceOfferingService.updateService(id, serviceOffering);
            return ResponseEntity.ok(updatedService);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable Long serviceId) {
        try {
            serviceOfferingService.deleteServiceById(serviceId);
            return ResponseEntity.ok("Service deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
