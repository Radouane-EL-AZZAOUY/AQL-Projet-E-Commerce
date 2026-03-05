package com.ecommerce.service;

import com.ecommerce.dto.CategoryDto;
import com.ecommerce.entity.Category;
import com.ecommerce.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;

    @BeforeEach
    void setUp() {
        category = Category.builder()
                .id(1L)
                .name("Electronics")
                .build();
    }

    @Test
    void findAll_ReturnsAllCategoriesAsDto() {
        when(categoryRepository.findAll()).thenReturn(List.of(category));

        List<CategoryDto> result = categoryService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getName()).isEqualTo("Electronics");
    }

    @Test
    void findById_WhenFound_ReturnsDto() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        CategoryDto result = categoryService.findById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Electronics");
    }

    @Test
    void findById_WhenNotFound_Throws() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.findById(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    void create_WhenNameUnique_SavesAndReturnsDto() {
        CategoryDto dto = new CategoryDto(null, "NewCat");
        when(categoryRepository.existsByName("NewCat")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> {
            Category saved = inv.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        CategoryDto result = categoryService.create(dto);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("NewCat");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void create_WhenNameExists_Throws() {
        CategoryDto dto = new CategoryDto(null, "Existing");
        when(categoryRepository.existsByName("Existing")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.create(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category name already exists");
    }

    @Test
    void update_WhenFound_UpdatesAndReturnsDto() {
        CategoryDto dto = new CategoryDto(null, "Updated");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(any(Category.class))).thenAnswer(inv -> inv.getArgument(0));

        CategoryDto result = categoryService.update(1L, dto);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Updated");
    }

    @Test
    void update_WhenNotFound_Throws() {
        CategoryDto dto = new CategoryDto(null, "Updated");
        when(categoryRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.update(42L, dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category not found");
    }

    @Test
    void deleteById_WhenExists_Deletes() {
        when(categoryRepository.existsById(1L)).thenReturn(true);

        categoryService.deleteById(1L);

        verify(categoryRepository).deleteById(1L);
    }

    @Test
    void deleteById_WhenNotExists_Throws() {
        when(categoryRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> categoryService.deleteById(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Category not found");
    }
}

