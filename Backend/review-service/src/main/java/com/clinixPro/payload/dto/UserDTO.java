package com.clinixPro.payload.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
public class UserDTO {

    private Long id;
    private String fullName;
    private String userName;
    private String email;
    private String phone;
    private String address;
    private String role;
    private String gender;
    private String password;
    private String image;

}