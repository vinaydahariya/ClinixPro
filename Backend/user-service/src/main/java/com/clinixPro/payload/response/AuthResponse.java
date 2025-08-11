package com.clinixPro.payload.response;

import com.clinixPro.domain.Role;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String refresh_token;
    private String message;
    private String title;
    private Role role;
}
