package com.clinixPro.service;

import com.clinixPro.payload.dto.CategoryDto;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.entity.Category;

import java.util.Set;

public interface CategoryService {

    Category saveCategory(Category category, ClinicDto clinicDto);
    Set<Category> getAllCategoriesByClinic(Long id);
    CategoryDto getCategoryById(String id) throws Exception;
    void deleteCategoryById(String id, Long clinicId) throws Exception;
    Category findByIdAndClinicId(String id, Long clinicId) throws Exception;
    Category updateCategory(String id, Long clinicId, CategoryDto categoryDto) throws Exception;


}
