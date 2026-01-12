package com.example.api_gateway.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

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
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // ✅ PUBLIC ENDPOINTS
        if (path.startsWith("/auth/login")
                || path.startsWith("/auth/logout")
                || path.startsWith("/auth/validate")) {
            return chain.filter(exchange);
        }

        // ✅ READ AUTH HEADER
        String authHeader = exchange
                .getRequest()
                .getHeaders()
                .getFirst("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse()
                    .setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // ✅ VALIDATE TOKEN VIA AUTH SERVICE
        return webClient
                .get()
                .uri(validateUrl)
                .header("Authorization", authHeader)
                .retrieve()
                .bodyToMono(Void.class)
                .then(chain.filter(exchange))
                .onErrorResume(e -> {
                    exchange.getResponse()
                            .setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                });
    }

    @Override
    public int getOrder() {
        return -100;
    }
}

