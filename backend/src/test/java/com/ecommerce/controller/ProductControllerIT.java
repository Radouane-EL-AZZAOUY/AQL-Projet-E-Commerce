package com.ecommerce.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listProducts_ReturnsPaginatedResponse() throws Exception {
        mockMvc.perform(get("/products").param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(10));
    }

    @Test
    void getProductById_WhenExists_ReturnsProduct() throws Exception {
        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.price").exists())
                .andExpect(jsonPath("$.stock").exists());
    }

    @Test
    void getProductById_WhenNotExists_Returns404() throws Exception {
        mockMvc.perform(get("/products/99999"))
                .andExpect(status().isBadRequest());
    }
}
