package com.clinixPro.controller;

import com.clinixPro.payload.dto.CategoryDto;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.entity.Category;
import com.clinixPro.service.CategoryService;
import com.clinixPro.service.client.ClinicFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories/clinic-owner")
public class ClinicCategoryController {

    private final CategoryService categoryService;
    private final ClinicFeignClient clinicFeignClient;

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category,
            @RequestHeader("Authorization") String jwt

    ) throws Exception {
        ClinicDto clinicDto = clinicFeignClient.getClinicByOwnerId(jwt).getBody();
        Category saveCategory = categoryService.saveCategory(category, clinicDto);
        return ResponseEntity.ok(saveCategory);
    }

    @GetMapping("/clinic/{clinicId}/category/{id}")
    public ResponseEntity<Category> getCategoriesByIdClinic(
            @PathVariable Long clinicId,
            @PathVariable String id
    ) throws Exception {
        Category categories = categoryService.findByIdAndClinicId(id, clinicId);
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable String id,
            @RequestHeader("Authorization") String jwt
    )throws Exception{
        ClinicDto clinicDto = clinicFeignClient.getClinicByOwnerId(jwt).getBody();
        categoryService.deleteCategoryById(id, clinicDto.getId());
        return ResponseEntity.ok("category delete successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable String id,
            @RequestBody CategoryDto categoryDto,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        ClinicDto clinicDto = clinicFeignClient.getClinicByOwnerId(jwt).getBody();
        Long clinicId = clinicDto.getId();

        Category updatedCategory = categoryService.updateCategory(id, clinicId, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }


}
