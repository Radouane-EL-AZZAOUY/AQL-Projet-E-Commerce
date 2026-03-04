package com.ecommerce.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce API")
                        .version("1.0")
                        .description("API REST du projet fil rouge E-Commerce (AQL). " +
                                "Auth: POST /auth/login ou /auth/register pour obtenir un token JWT, puis utiliser l'en-tête Authorization: Bearer <token>."))
                .servers(List.of(
                        new Server().url("/api").description("Context path API"),
                        new Server().url("http://localhost:" + serverPort + "/api").description("Backend local")));
    }
}
