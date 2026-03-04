package com.ecommerce.config;

import com.ecommerce.entity.*;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartService cartService;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Admin
        User admin = User.builder()
                .username("admin")
                .email("admin@shop.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build();
        admin = userRepository.save(admin);
        cartService.createCartForUser(admin);

        // Client de démo
        User client = User.builder()
                .username("client")
                .email("client@example.com")
                .password(passwordEncoder.encode("client123"))
                .role(Role.CLIENT)
                .build();
        client = userRepository.save(client);
        cartService.createCartForUser(client);

        // Catégories
        Category catElectro = Category.builder().name("Électronique").build();
        Category catVetements = Category.builder().name("Vêtements").build();
        Category catMaison = Category.builder().name("Maison & Cuisine").build();
        Category catSport = Category.builder().name("Sport").build();
        Category catLivres = Category.builder().name("Livres").build();
        categoryRepository.saveAll(List.of(catElectro, catVetements, catMaison, catSport, catLivres));

        // Produits Électronique
        productRepository.save(Product.builder()
                .name("Smartphone X Pro")
                .description("Smartphone dernière génération, écran 6.5\", 128 Go.")
                .price(new BigDecimal("599.99"))
                .stock(50)
                .category(catElectro)
                .deleted(false)
                .build());
        productRepository.save(Product.builder()
                .name("Écouteurs sans fil")
                .description("Écouteurs Bluetooth avec réduction de bruit.")
                .price(new BigDecimal("89.99"))
                .stock(120)
                .category(catElectro)
                .deleted(false)
                .build());
        productRepository.save(Product.builder()
                .name("Chargeur rapide 65W")
                .description("Chargeur USB-C compatible fast charging.")
                .price(new BigDecimal("34.99"))
                .stock(200)
                .category(catElectro)
                .deleted(false)
                .build());
        productRepository.save(Product.builder()
                .name("Clavier mécanique")
                .description("Clavier gaming RGB, switches bleus.")
                .price(new BigDecimal("129.00"))
                .stock(45)
                .category(catElectro)
                .deleted(false)
                .build());

        // Produits Vêtements
        productRepository.save(Product.builder()
                .name("T-shirt Basic")
                .description("T-shirt en coton bio, coupe unisexe.")
                .price(new BigDecimal("19.99"))
                .stock(200)
                .category(catVetements)
                .deleted(false)
                .build());
        productRepository.save(Product.builder()
                .name("Jean slim")
                .description("Jean coupe slim, matière stretch.")
                .price(new BigDecimal("49.99"))
                .stock(80)
                .category(catVetements)
                .deleted(false)
                .build());
        productRepository.save(Product.builder()
                .name("Pull en laine")
                .description("Pull col rond, laine mérinos.")
                .price(new BigDecimal("79.99"))
                .stock(35)
                .category(catVetements)
                .deleted(false)
                .build());

        // Produits Maison
        productRepository.save(Product.builder()
                .name("Cafetière programmable")
                .description("Cafetière 12 tasses, minuterie et maintien au chaud.")
                .price(new BigDecimal("59.99"))
                .stock(60)
                .category(catMaison)
                .deleted(false)
                .build());
        productRepository.save(Product.builder()
                .name("Set de couverts 24 pièces")
                .description("Inox 18/10, lave-vaisselle.")
                .price(new BigDecimal("44.99"))
                .stock(40)
                .category(catMaison)
                .deleted(false)
                .build());

        // Produits Sport
        productRepository.save(Product.builder()
                .name("Ballon de football")
                .description("Taille 5, cuir synthétique.")
                .price(new BigDecimal("24.99"))
                .stock(90)
                .category(catSport)
                .deleted(false)
                .build());
        productRepository.save(Product.builder()
                .name("Tapis de yoga")
                .description("Tapis antidérapant 6 mm, 183 x 61 cm.")
                .price(new BigDecimal("29.99"))
                .stock(70)
                .category(catSport)
                .deleted(false)
                .build());

        // Produits Livres
        productRepository.save(Product.builder()
                .name("Guide du développement web")
                .description("Ouvrage de référence HTML, CSS, JavaScript.")
                .price(new BigDecimal("35.00"))
                .stock(25)
                .category(catLivres)
                .deleted(false)
                .build());
        productRepository.save(Product.builder()
                .name("Roman best-seller")
                .description("Édition brochée, 400 pages.")
                .price(new BigDecimal("14.99"))
                .stock(150)
                .category(catLivres)
                .deleted(false)
                .build());
    }
}
