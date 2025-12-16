package com.example.auth_service.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "security.jwt")
@Data
public class JwtProperties {
    private String secret;
    private long expiration;
}
