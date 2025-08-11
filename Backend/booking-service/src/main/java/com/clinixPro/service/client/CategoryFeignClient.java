package com.clinixPro.service.client;

import com.clinixPro.payload.dto.CategoryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("CATEGORY-SERVICE")
public interface CategoryFeignClient {

//    @GetMapping("/api/categories/{id}")
//    public ResponseEntity<CategoryDto> getCategoryById(
//            @PathVariable String id
//    ) throws Exception;

    @GetMapping("/api/categories/clinic-owner/clinic/{clinicId}/category/{id}")
    public ResponseEntity<CategoryDto> getCategoriesByIdClinic(
            @PathVariable Long clinicId,
            @PathVariable String id
    ) throws Exception;

    @GetMapping("/api/categories/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(
            @PathVariable String id
    ) throws Exception;

}
