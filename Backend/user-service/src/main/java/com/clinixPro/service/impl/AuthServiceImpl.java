package com.clinixPro.service.impl;

import com.clinixPro.entity.User;
import com.clinixPro.payload.dto.SignupDTO;
import com.clinixPro.payload.response.AuthResponse;
import com.clinixPro.payload.response.TokenResponse;
import com.clinixPro.repository.UserRepository;
import com.clinixPro.service.AuthService;
import com.clinixPro.service.KeyclockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final KeyclockService keyclockService;

    @Override
    public AuthResponse login(String username, String password) throws Exception {
        TokenResponse tokenResponse = keyclockService.getAdminAccessToken(
                username,
                password,
                "password", null
        );
        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefresh_token(tokenResponse.getRefreshToken());
        authResponse.setJwt(tokenResponse.getAccessToken());
        authResponse.setMessage("login success");
        return authResponse;
    }

    @Override
    public AuthResponse signup(SignupDTO req) throws Exception {
        keyclockService.createUser(req);
        User user = new User();
        user.setUserName(req.getUsername());
        user.setPassword(req.getPassword());
        user.setEmail(req.getEmail());
        user.setFullName(req.getFirstName()+" "+req.getLastName());
        user.setRole(req.getRole());
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        TokenResponse tokenResponse = keyclockService.getAdminAccessToken(
                req.getUsername(),
                req.getPassword(),
                "password", null
        );

        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefresh_token(tokenResponse.getRefreshToken());
        authResponse.setJwt(tokenResponse.getAccessToken());
        authResponse.setRole(user.getRole());
        authResponse.setMessage("Register success");
        return authResponse;
    }

    @Override
    public AuthResponse getAccessTokenFromRefreshToken(String refreshToken) throws Exception {
        TokenResponse tokenResponse = keyclockService.getAdminAccessToken(
                null,
                null,
                "refresh_token", refreshToken
        );
        AuthResponse authResponse = new AuthResponse();
        authResponse.setRefresh_token(tokenResponse.getRefreshToken());
        authResponse.setJwt(tokenResponse.getAccessToken());
        authResponse.setMessage("login success");
        return authResponse;
    }
}
