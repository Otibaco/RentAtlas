package com.example.auth_service.controller;

import java.time.Duration;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.LoginResponse;
import com.example.auth_service.model.User;
import com.example.auth_service.service.AuthService;
import com.example.auth_service.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody @Valid LoginRequest request) {
        User user = authService.authenticate(request);
        String token = jwtService.generateToken(user);

        boolean isProd = false; // set via env later

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(isProd) // ❗ false for localhost
                .sameSite(isProd ? "None" : "Lax")
                .path("/")
                .maxAge(Duration.ofHours(1))
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(token, "Login successful"));
    }

    /**
     * Used by frontend to restore session
     */
    @GetMapping("/me")
    public User me(HttpServletRequest request) {
        System.out.println("AUTH SERVICE HIT /auth/me");

        String token = jwtService.extractTokenFromRequest(request);
        return jwtService.getUserFromToken(token);
    }

    /**
     * Called by API Gateway
     */
    @GetMapping("/validate")
    public void validate(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        String token = authHeader.substring(7);
        jwtService.validateToken(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        boolean isProd = false; // set via env later

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(isProd) // ❗ false for localhost
                .sameSite(isProd ? "None" : "Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
