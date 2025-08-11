package com.clinixPro.entity;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document
@Data
public class Category {

    @Id
    private String id;

    @NotNull(message = "Name cannot be null")
    private String name;


    private String image;

    @NotNull(message = "Clinic Id cannot be null")
    private Long clinicId;

}
