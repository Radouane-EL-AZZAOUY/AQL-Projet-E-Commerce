package com.ecommerce.config;

import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class DataInitializerTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void run_PopulatesInitialData() {
        assertThat(userRepository.count()).isGreaterThanOrEqualTo(2);
        assertThat(categoryRepository.count()).isGreaterThan(0);
        assertThat(productRepository.count()).isGreaterThan(0);
    }
}

