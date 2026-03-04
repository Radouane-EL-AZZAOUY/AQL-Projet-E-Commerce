package com.ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Contournement du double préfixe /api quand Swagger UI charge le spec.
 * Si le client demande /api/api/v3/api-docs, le path reçu est /api/v3/api-docs.
 * On transmet alors vers le endpoint SpringDoc /v3/api-docs.
 */
@Controller
@RequestMapping("/api")
public class SwaggerForwardController {

    @GetMapping("/v3/api-docs")
    public String forwardApiDocs() {
        return "forward:/v3/api-docs";
    }

    @GetMapping("/v3/api-docs/swagger-config")
    public String forwardSwaggerConfig() {
        return "forward:/v3/api-docs/swagger-config";
    }
}
