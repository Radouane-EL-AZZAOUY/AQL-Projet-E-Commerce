package com.ecommerce.model;
import jakarta.persistence.*;
import java.util.List;

@Entity @Table(name = "categorie")
public class Categorie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true) private String nom;
    @OneToMany(mappedBy = "categorie") private List<Produit> produits;
    public Categorie() {} public Categorie(String nom) { this.nom = nom; }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; } public void setNom(String nom) { this.nom = nom; }
    public List<Produit> getProduits() { return produits; } public void setProduits(List<Produit> p) { this.produits = p; }
}
