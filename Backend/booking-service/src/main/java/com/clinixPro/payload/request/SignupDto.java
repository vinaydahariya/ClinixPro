package com.clinixPro.payload.request;


import com.clinixPro.domain.UserRole;
import lombok.Data;

@Data
public class SignupDto {
    private String email;
    private String password;
    private String phone;
    private String fullName;
    private UserRole role;
}