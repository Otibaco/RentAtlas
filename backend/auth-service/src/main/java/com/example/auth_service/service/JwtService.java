package com.example.auth_service.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.example.auth_service.config.JwtProperties;
import com.example.auth_service.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    public String generateToken(User user) {

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis()
                                + jwtProperties.getExpiration())
                )
                .signWith(
                        Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes()),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    /**
     * ✅ VALIDATE TOKEN (throws exception if invalid)
     */
    public void validateToken(String token) {
        Jwts.parserBuilder()
                .setSigningKey(jwtProperties.getSecret().getBytes())
                .build()
                .parseClaimsJws(token);
    }

    /**
     * ✅ SAFE BOOLEAN CHECK (used by filters)
     */
    public boolean isTokenValid(String token) {
        try {
            validateToken(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public String extractTokenFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        return authHeader.substring(7);
    }

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
