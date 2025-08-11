package com.clinixPro.service.impl;

import com.clinixPro.exception.CategoryNotFoundException;
import com.clinixPro.payload.dto.CategoryDto;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.entity.Category;
import com.clinixPro.repository.CategoryRepository;
import com.clinixPro.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Set;
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public Category saveCategory(Category category, ClinicDto clinicDto) {
        Category newCategory = new Category();
        newCategory.setName(category.getName());
        newCategory.setClinicId(clinicDto.getId());
        newCategory.setImage(category.getImage());
        return categoryRepository.save(newCategory);
    }

    @Override
    public Set<Category> getAllCategoriesByClinic(Long id) {
        return categoryRepository.findByClinicId(id);
    }

    @Override
    public CategoryDto getCategoryById(String id) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not exist with id " + id));

        CategoryDto categoryDto = modelMapper.map(category, CategoryDto.class);
        
        return categoryDto;
    }

    @Override
    public void deleteCategoryById(String id, Long clinicId) throws Exception {
        CategoryDto categoryDto = getCategoryById(id);
        Category category = modelMapper.map(categoryDto, Category.class);
        if(!category.getClinicId().equals(clinicId)){
            throw new Exception("you don't have permission to delete this category");
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public Category findByIdAndClinicId(String id, Long clinicId) throws Exception {
        Category category = categoryRepository.findByIdAndClinicId(id, clinicId);
        if (category==null){
            throw new Exception("Category not found");
        }
        return category;
    }

    @Override
    public Category updateCategory(String id, Long clinicId, CategoryDto categoryDto) throws Exception {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not exist with id " + id));

        if (!existingCategory.getClinicId().equals(clinicId)) {
            throw new Exception("You don't have permission to update this category");
        }

        // Update fields from DTO
        existingCategory.setName(categoryDto.getName());
        existingCategory.setImage(categoryDto.getImage());

        return categoryRepository.save(existingCategory);
    }



}
