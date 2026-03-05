package com.ecommerce.model;
import jakarta.persistence.*;
@Entity @Table(name = "role")
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true) private String nom;
    public Role() {} public Role(String nom) { this.nom = nom; }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; } public void setNom(String nom) { this.nom = nom; }
}
