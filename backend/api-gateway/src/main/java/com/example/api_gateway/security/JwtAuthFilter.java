package com.example.api_gateway.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private final WebClient webClient;
    private final String validateUrl;

    public JwtAuthFilter(
            WebClient.Builder builder,
            @Value("${security.auth.validate-url}") String validateUrl) {

        this.webClient = builder.build();
        this.validateUrl = validateUrl;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // 1️⃣ Allow public auth endpoints
        if (path.startsWith("/auth")) {
            return chain.filter(exchange);
        }

        // 2️⃣ Read Authorization header
        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // 3️⃣ Call auth-service for validation
        return webClient
                .get()
                .uri(validateUrl)
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .retrieve()
                .bodyToMono(Void.class)
                .timeout(Duration.ofSeconds(3))
                .then(chain.filter(exchange))
                .onErrorResume(ex -> {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                });
    }

    /**
     * Security filters must run early
     */
    @Override
    public int getOrder() {
        return -100;
    }
}
