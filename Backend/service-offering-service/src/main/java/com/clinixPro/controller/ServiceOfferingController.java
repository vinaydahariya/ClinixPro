package com.clinixPro.controller;

import com.clinixPro.entity.ServiceOffering;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/service-offering")
@RequiredArgsConstructor
public class ServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    @GetMapping("/clinic/{clinicId}")
    public ResponseEntity<Set<ServiceOffering>> getServicesByClinicId(
            @PathVariable Long clinicId,
            @RequestParam(required = false) String categoryId) {
        Set<ServiceOffering> services = serviceOfferingService
                .getAllServiceByClinicId(clinicId, categoryId);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/list/{ids}")
    public ResponseEntity<Set<ServiceOffering>> getServicesByIds(
            @PathVariable Set<Long> ids) {
        Set<ServiceOffering> services = serviceOfferingService.getServicesByIds(ids);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOffering> getServiceById(@PathVariable Long id) throws Exception {
        try {
            ServiceOffering service = serviceOfferingService.getServiceById(id);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClinicDto>> searchClinicsByServiceName(@RequestParam String name) {
        List<ClinicDto> clinics = serviceOfferingService.searchClinicsByServiceName(name);
        return ResponseEntity.ok(clinics);
    }

}