package com.ecommerce.service;

import com.ecommerce.dto.PageResponse;
import com.ecommerce.dto.ProductDto;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private Category category;

    @BeforeEach
    void setUp() {
        category = Category.builder().id(1L).name("Test").build();
        product = Product.builder()
                .id(1L)
                .name("Product 1")
                .price(BigDecimal.valueOf(29.99))
                .stock(10)
                .deleted(false)
                .category(category)
                .build();
    }

    @Test
    void findByIdPublic_WhenProductExistsAndNotDeleted_ReturnsDto() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        ProductDto result = productService.findByIdPublic(1L);
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Product 1");
        assertThat(result.getStock()).isEqualTo(10);
    }

    @Test
    void findByIdPublic_WhenProductDeleted_Throws() {
        product.setDeleted(true);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> productService.findByIdPublic(1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void findByIdPublic_WhenProductNotFound_Throws() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productService.findByIdPublic(1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void create_SavesProduct() {
        ProductDto dto = ProductDto.builder()
                .name("New Product")
                .price(BigDecimal.valueOf(99.99))
                .stock(5)
                .categoryId(1L)
                .build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId(2L);
            return p;
        });
        ProductDto result = productService.create(dto);
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("New Product");
        assertThat(result.getPrice()).isEqualByComparingTo("99.99");
    }

    @Test
    void updateStock_UpdatesStock() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        ProductDto result = productService.updateStock(1L, 20);
        assertThat(result.getStock()).isEqualTo(20);
    }

    @Test
    void updateStock_NegativeStock_Throws() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> productService.updateStock(1L, -1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("negative");
    }

    @Test
    void deleteById_SetsDeletedTrue() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        productService.deleteById(1L);
        verify(productRepository).save(argThat(p -> p.isDeleted()));
    }
}
