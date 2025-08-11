package com.clinixPro.payload.dto;

import com.clinixPro.domain.Role;
import lombok.Data;

@Data
public class KeycloakUserDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private Role role;
}
