package com.ecommerce.repository;
import com.ecommerce.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {}
