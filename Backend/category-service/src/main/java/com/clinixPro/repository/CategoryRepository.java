package com.clinixPro.repository;

import com.clinixPro.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {

    Set<Category> findByClinicId(Long clinicId);

    Category findByIdAndClinicId(String id, Long clinicId);


}