package com.ecommerce.model;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Panier de l'utilisateur (persistant en session via BDD).
 */
@Entity @Table(name = "panier")
public class Panier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "utilisateur_id", unique = true) private Utilisateur utilisateur;
    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LignePanier> lignes = new ArrayList<>();

    public Panier() {}
    public Panier(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public Double getTotal() {
        return lignes.stream().mapToDouble(l -> l.getProduit().getPrix() * l.getQuantite()).sum();
    }
    public int getNombreArticles() {
        return lignes.stream().mapToInt(LignePanier::getQuantite).sum();
    }

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Utilisateur getUtilisateur() { return utilisateur; } public void setUtilisateur(Utilisateur u) { this.utilisateur = u; }
    public List<LignePanier> getLignes() { return lignes; } public void setLignes(List<LignePanier> l) { this.lignes = l; }
}
