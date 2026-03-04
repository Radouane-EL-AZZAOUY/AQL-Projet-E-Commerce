package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByDeletedFalse();

    Page<Product> findByDeletedFalse(Pageable pageable);

    Page<Product> findByDeletedFalseAndNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findByDeletedFalseAndCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.deleted = false AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR :search IS NULL) AND (:categoryId IS NULL OR p.category.id = :categoryId)")
    Page<Product> searchByDeletedFalseAndOptionalFilters(String search, Long categoryId, Pageable pageable);
}
