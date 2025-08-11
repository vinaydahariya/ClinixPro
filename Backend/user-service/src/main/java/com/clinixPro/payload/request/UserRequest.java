package com.clinixPro.payload.request;

import com.clinixPro.domain.Role;
import com.clinixPro.payload.dto.Credential;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserRequest {
    private String username;
    private boolean enabled;
    private String firstName;
    private String lastName;
    private String email;
    private List<Credential> credentials = new ArrayList<>();

}
