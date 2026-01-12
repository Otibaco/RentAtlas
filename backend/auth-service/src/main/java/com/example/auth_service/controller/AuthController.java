package com.example.auth_service.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.LoginResponse;
import com.example.auth_service.model.User;
import com.example.auth_service.service.AuthService;
import com.example.auth_service.service.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    /**
     * LOGIN
     * Returns token + user info
     * NO cookies here
     */

    


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody @Valid LoginRequest request) {

        User user = authService.authenticate(request);
        String token = jwtService.generateToken(user);

        LoginResponse response = new LoginResponse(
                token,
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );

        return ResponseEntity.ok(response);
    }

    /**
     * RESTORE SESSION
     * Requires Authorization header
     */
    @GetMapping("/me")
    public ResponseEntity<User> me(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {

        String token = jwtService.extractTokenFromHeader(authHeader);
        User user = jwtService.getUserFromToken(token);

        return ResponseEntity.ok(user);
    }

    /**
     * TOKEN VALIDATION (used by API Gateway)
     */
    @GetMapping("/validate")
    public ResponseEntity<Void> validate(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {

        String token = jwtService.extractTokenFromHeader(authHeader);
        jwtService.validateToken(token);

        return ResponseEntity.ok().build();
    }

    /**
     * LOGOUT
     * Stateless — frontend handles token removal
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }
}
