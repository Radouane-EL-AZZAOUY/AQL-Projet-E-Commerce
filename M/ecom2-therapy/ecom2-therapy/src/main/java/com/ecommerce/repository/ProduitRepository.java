package com.ecommerce.repository;
import com.ecommerce.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByActifTrue();
    List<Produit> findByNomContainingIgnoreCaseAndActifTrue(String nom);
    List<Produit> findByCategorieIdAndActifTrue(Long categorieId);
    List<Produit> findByNomContainingIgnoreCaseAndCategorieIdAndActifTrue(String nom, Long categorieId);
}
