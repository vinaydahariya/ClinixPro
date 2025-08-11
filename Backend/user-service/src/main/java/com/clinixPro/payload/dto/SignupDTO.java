package com.clinixPro.payload.dto;

import com.clinixPro.domain.Role;
import lombok.Data;

@Data
public class SignupDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String username;
    private Role role;



}
