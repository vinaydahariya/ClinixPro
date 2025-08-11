package com.clinixPro.controller;

import com.clinixPro.entity.Category;
import com.clinixPro.payload.dto.CategoryDto;
import com.clinixPro.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;


@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final ModelMapper modelMapper;

    private final CategoryService categoryService;

    @GetMapping("/clinic/{id}")
    public ResponseEntity<Set<Category>> getCategoriesByClinic(
            @PathVariable Long id
    ){
        Set<Category> categories = categoryService.getAllCategoriesByClinic(id);
        return ResponseEntity.ok(categories);
    }


    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(
            @PathVariable String id
    ) throws Exception {
        CategoryDto categoryDto = categoryService.getCategoryById(id);
        return ResponseEntity.ok(categoryDto);
    }


}
