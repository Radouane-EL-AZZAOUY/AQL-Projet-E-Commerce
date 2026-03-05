package com.ecommerce.repository;
import com.ecommerce.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByClientIdOrderByDateCommandeDesc(Long clientId);
}
