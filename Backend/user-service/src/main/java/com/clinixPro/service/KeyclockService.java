package com.clinixPro.service;

import com.clinixPro.payload.dto.*;
import com.clinixPro.payload.request.UserRequest;
import com.clinixPro.payload.response.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KeyclockService {

    private static final String KEYCLOAK_BASE_URL = "http://localhost:8080";
    private static final String KEYCLOAK_ADMIN_API = KEYCLOAK_BASE_URL + "/admin/realms/master/users";

    private static final String TOKEN_URL = KEYCLOAK_BASE_URL + "/realms/master/protocol/openid-connect/token";
    private static final String CLIENT_ID = "clinic-client"; // for token request
    private static final String CLIENT_UUID = "03e4d63e-c604-4237-ba71-e082e59cf096"; // for client-specific admin actions
    private static final String CLIENT_SECRET = "WOSt46X1vweHC9J3J3rxr0UZJ1lEVsif";
    private static final String GRANT_TYPE = "password";
    private static final String scope = "openid profile email";
    private static final String username = "clinixpro";
    private static final String password = "Vinay123@#$";

    private final RestTemplate restTemplate;

    public void createUser(SignupDTO signupDTO) throws Exception {

        String ACCESS_TOKEN = getAdminAccessToken(username,
                password,
                GRANT_TYPE, null).getAccessToken();

        Credential credential = new Credential();
        credential.setTemporary(false);
        credential.setType("password");
        credential.setValue(signupDTO.getPassword());

        UserRequest userRequest = new UserRequest();
        userRequest.setUsername(signupDTO.getUsername());
        userRequest.setEmail(signupDTO.getEmail());
        userRequest.setEnabled(true);
        userRequest.setFirstName(signupDTO.getFirstName());
        userRequest.setLastName(signupDTO.getLastName());
        userRequest.getCredentials().add(credential);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.setBearerAuth(ACCESS_TOKEN);

        HttpEntity<UserRequest> requestHttpEntity = new HttpEntity<>(userRequest, httpHeaders);

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                KEYCLOAK_ADMIN_API,
                HttpMethod.POST,
                requestHttpEntity,
                String.class
        );

        if (responseEntity.getStatusCode() == HttpStatus.CREATED) {
            System.out.println("user created successfully");

            KeycloakUserDTO user = fetchFirstUserByUsername(signupDTO.getUsername(), ACCESS_TOKEN);
            KeycloakRole role = getRoleByName(CLIENT_UUID, ACCESS_TOKEN, signupDTO.getRole().toString());

            List<KeycloakRole> roles = new ArrayList<>();
            roles.add(role);

            assignRoleToUser(user.getId(), CLIENT_UUID, roles, ACCESS_TOKEN);
        } else {
            System.out.println("user creation failed");
            throw new Exception("User creation failed: " + (responseEntity.getBody() != null ? responseEntity.getBody() : "No response body"));
        }
    }

    public TokenResponse getAdminAccessToken(String username,
                                             String password,
                                             String grantType,
                                             String refreshToken) throws Exception {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // FIXED

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", grantType);
        requestBody.add("username", username);
        requestBody.add("password", password);
        requestBody.add("client_id", CLIENT_ID);
        requestBody.add("client_secret", CLIENT_SECRET);
        requestBody.add("scope", scope);

        if (refreshToken != null) {
            requestBody.add("refresh_token", refreshToken); // Only if not null
        }

        HttpEntity<MultiValueMap<String, String>> requestHttpEntity = new HttpEntity<>(requestBody, httpHeaders);

        ResponseEntity<TokenResponse> responseEntity = restTemplate.exchange(
                TOKEN_URL,
                HttpMethod.POST,
                requestHttpEntity,
                TokenResponse.class
        );

        if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null) {
            return responseEntity.getBody();
        }
        throw new Exception("Failed to obtain access token");
    }

    public KeycloakRole getRoleByName(String clientId,
                                      String token,
                                      String role) {
        String url = KEYCLOAK_BASE_URL + "/admin/realms/master/clients/" + clientId + "/roles/" + role;

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Authorization", "Bearer " + token); // FIXED (space after Bearer)
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> requestHttpEntity = new HttpEntity<>(httpHeaders);

        ResponseEntity<KeycloakRole> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestHttpEntity,
                KeycloakRole.class
        );

        return responseEntity.getBody();
    }

    public KeycloakUserDTO fetchFirstUserByUsername(String username, String token) throws Exception {
        String url = KEYCLOAK_BASE_URL + "/admin/realms/master/users?username=" + username;

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(token);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestHttpEntity = new HttpEntity<>(httpHeaders);

        ResponseEntity<KeycloakUserDTO[]> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestHttpEntity,
                KeycloakUserDTO[].class
        );

        KeycloakUserDTO[] users = responseEntity.getBody();
        if (users != null && users.length > 0) {
            return users[0];
        }
        throw new Exception("User not found with username " + username);
    }

    public void assignRoleToUser(String userId,
                                 String clientId,
                                 List<KeycloakRole> roles,
                                 String token) throws Exception {

        String url = KEYCLOAK_BASE_URL + "/admin/realms/master/users/" + userId + "/role-mappings/clients/" + clientId;

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(token);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<KeycloakRole>> requestHttpEntity = new HttpEntity<>(roles, httpHeaders);

        try {
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestHttpEntity,
                    String.class
            );
        } catch (Exception e) {
            throw new Exception("Failed to assign new role: " + e.getMessage());
        }
    }

    public KeycloakUserDTO fetchUserProfileByJwt(String token) throws Exception {

        String url = KEYCLOAK_BASE_URL + "/realms/master/protocol/openid-connect/userinfo";

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Authorization", token);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestHttpEntity = new HttpEntity<>(httpHeaders);

        try {
            ResponseEntity<KeycloakUserDTO> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestHttpEntity,
                    KeycloakUserDTO.class
            );
            return responseEntity.getBody();
        } catch (Exception e) {
            throw new Exception("Failed to get user information: " + e.getMessage());
        }
    }
    public void updateUserRoleInKeycloak(String email, String newRole) throws Exception {
        // ✅ Get Admin Access Token
        String accessToken = getAdminAccessToken(username, password, GRANT_TYPE, null).getAccessToken();

        // ✅ Find user by email
        String findUserUrl = KEYCLOAK_BASE_URL + "/admin/realms/master/users?email=" + email;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<KeycloakUserDTO[]> responseEntity = restTemplate.exchange(
                findUserUrl,
                HttpMethod.GET,
                requestEntity,
                KeycloakUserDTO[].class
        );

        KeycloakUserDTO[] users = responseEntity.getBody();
        if (users == null || users.length == 0) {
            throw new Exception("User not found in Keycloak with email: " + email);
        }

        String userId = users[0].getId();

        // ✅ Step 1: Remove all current roles
        String currentRolesUrl = KEYCLOAK_BASE_URL + "/admin/realms/master/users/" + userId +
                "/role-mappings/clients/" + CLIENT_UUID;

        ResponseEntity<KeycloakRole[]> currentRolesResponse = restTemplate.exchange(
                currentRolesUrl,
                HttpMethod.GET,
                requestEntity,
                KeycloakRole[].class
        );

        KeycloakRole[] currentRoles = currentRolesResponse.getBody();
        if (currentRoles != null && currentRoles.length > 0) {
            HttpEntity<KeycloakRole[]> deleteRequest = new HttpEntity<>(currentRoles, headers);
            restTemplate.exchange(
                    currentRolesUrl,
                    HttpMethod.DELETE,
                    deleteRequest,
                    String.class
            );
        }

        // ✅ Step 2: Assign new role
        KeycloakRole newRoleObj = getRoleByName(CLIENT_UUID, accessToken, newRole);

        List<KeycloakRole> roles = new ArrayList<>();
        roles.add(newRoleObj);

        assignRoleToUser(userId, CLIENT_UUID, roles, accessToken);
    }


}
