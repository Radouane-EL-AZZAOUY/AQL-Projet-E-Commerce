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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
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
        verify(productRepository).save(argThat(Product::isDeleted));
    }

    @Test
    void findAllAdmin_ReturnsPage() {
        Page<Product> page = new PageImpl<>(List.of(product), PageRequest.of(0, 10), 1);
        when(productRepository.findAll(any(PageRequest.class))).thenReturn(page);
        var result = productService.findAllAdmin(0, 10);
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getPage()).isZero();
        assertThat(result.getSize()).isEqualTo(10);
    }

    @Test
    void findAllPublic_WithSearchAndCategory_CallsRepository() {
        Page<Product> page = new PageImpl<>(List.of(product), PageRequest.of(0, 12), 1);
        when(productRepository.searchByDeletedFalseAndOptionalFilters(eq("phone"), eq(1L), any())).thenReturn(page);
        var result = productService.findAllPublic(0, 12, "  phone  ", 1L);
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void findAllPublic_WithNullFilters_CallsRepositoryWithNulls() {
        Page<Product> page = new PageImpl<>(List.of(product), PageRequest.of(0, 12), 1);
        when(productRepository.searchByDeletedFalseAndOptionalFilters(isNull(), isNull(), any())).thenReturn(page);
        var result = productService.findAllPublic(0, 12, null, null);
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void findAllPublic_WithBlankSearch_CallsRepositoryWithNullSearch() {
        Page<Product> page = new PageImpl<>(List.of(product), PageRequest.of(0, 12), 1);
        when(productRepository.searchByDeletedFalseAndOptionalFilters(isNull(), isNull(), any())).thenReturn(page);
        var result = productService.findAllPublic(0, 12, "   ", null);
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void findByIdAdmin_WhenFound_ReturnsDto() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        ProductDto result = productService.findByIdAdmin(1L);
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Product 1");
    }

    @Test
    void findByIdAdmin_WhenNotFound_Throws() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productService.findByIdAdmin(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void create_WithNullCategoryId_SavesWithoutCategory() {
        ProductDto dto = ProductDto.builder()
                .name("NoCat")
                .price(BigDecimal.ONE)
                .stock(0)
                .build();
        when(productRepository.save(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId(3L);
            return p;
        });
        ProductDto result = productService.create(dto);
        assertThat(result.getName()).isEqualTo("NoCat");
        verify(productRepository).save(argThat(p -> p.getCategory() == null));
    }

    @Test
    void create_WhenCategoryNotFound_Throws() {
        ProductDto dto = ProductDto.builder()
                .name("X")
                .categoryId(999L)
                .build();
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productService.create(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    void create_WithNullStock_SavesWithZeroStock() {
        ProductDto dto = ProductDto.builder()
                .name("S")
                .price(BigDecimal.ONE)
                .categoryId(1L)
                .build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId(4L);
            return p;
        });
        ProductDto result = productService.create(dto);
        assertThat(result).isNotNull();
        verify(productRepository).save(argThat(p -> p.getStock() != null && p.getStock() == 0));
    }

    @Test
    void update_WhenFound_UpdatesAndReturnsDto() {
        ProductDto dto = ProductDto.builder()
                .name("Updated")
                .description("Desc")
                .price(BigDecimal.TEN)
                .stock(5)
                .categoryId(1L)
                .build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        ProductDto result = productService.update(1L, dto);
        assertThat(result.getName()).isEqualTo("Updated");
    }

    @Test
    void update_WhenCategoryIdNull_KeepsCategoryNull() {
        product.setCategory(null);
        ProductDto dto = ProductDto.builder()
                .name("U")
                .price(BigDecimal.ONE)
                .stock(1)
                .build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        productService.update(1L, dto);
        verify(productRepository).save(argThat(p -> p.getCategory() == null));
    }

    @Test
    void update_WhenCategoryNotFound_Throws() {
        ProductDto dto = ProductDto.builder()
                .name("U")
                .categoryId(999L)
                .build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productService.update(1L, dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    void deleteById_WhenNotFound_Throws() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productService.deleteById(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }
}
