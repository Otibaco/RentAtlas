package com.example.auth_service.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.example.auth_service.config.JwtProperties;
import com.example.auth_service.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    public String generateToken(User user) {
        byte[] keyBytes = jwtProperties.getSecret().getBytes();

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + jwtProperties.getExpiration())
                )
                .signWith(Keys.hmacShaKeyFor(keyBytes), SignatureAlgorithm.HS256)
                .compact();
    }

    public void validateToken(String token) {
        Jwts.parserBuilder()
                .setSigningKey(jwtProperties.getSecret().getBytes())
                .build()
                .parseClaimsJws(token);
    }

    /**
     * Extract JWT from HttpOnly cookie
     */
    public String extractTokenFromRequest(HttpServletRequest request) {
        if (request.getCookies() == null) {
            throw new RuntimeException("No cookies found");
        }

        for (Cookie cookie : request.getCookies()) {
            if ("token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        throw new RuntimeException("JWT cookie not found");
    }

    /**
     * Extract user info from JWT
     */
    public User getUserFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtProperties.getSecret().getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        User user = new User();
        user.setEmail(claims.getSubject());
        user.setRole(claims.get("role", String.class));

        return user;
    }
}
