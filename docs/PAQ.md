# Plan d'Assurance Qualité (PAQ) — Projet E-Commerce

**Projet fil rouge — Assurance Qualité Logicielle et Automatisation des Tests**

---

## 1. Introduction et objectifs du PAQ

Ce PAQ décrit de manière opérationnelle comment la qualité est assurée sur le projet **Site E-Commerce** (fil rouge). Il traduit la politique qualité en actions concrètes tout au long du cycle de développement.

**Objectifs :**
- Garantir la conformité aux exigences fonctionnelles et non fonctionnelles.
- Prévenir l’introduction des défauts (revues, standards, tests).
- Mettre en œuvre une stratégie de tests (unitaires, intégration, API).
- Suivre des indicateurs qualité (couverture, défauts, respect des standards).

---

## 2. Références normatives

| Référence | Rôle |
|-----------|------|
| **ISO 9001** | Systèmes de management de la qualité (cadre SMQ) |
| **ISO/IEC 25010** | Modèle de qualité des produits logiciels (caractéristiques qualité) |
| **ISO/IEC/IEEE 29119** | Tests logiciels (vocabulaire, documentation, processus) |
| **IEEE 730** | Processus d’assurance qualité logicielle |
| Bonnes pratiques de génie logiciel | Standards de développement (conventions, modularité) |

---

## 3. Périmètre du PAQ

- **Produit :** Application web e-commerce (backend Spring Boot, frontend React).
- **Fonctionnalités :** Catalogue, panier, commandes, gestion produits/catégories/stocks, rôles Visiteur / Client / Admin.
- **Cycle de vie :** Conception, développement, tests, livraison.

---

## 4. Organisation et responsabilités

| Rôle | Responsabilités qualité |
|------|-------------------------|
| Chef de projet | Piloter la qualité, valider objectifs et planning des revues |
| Responsable qualité | Définir et faire vivre le PAQ, stratégie de test, indicateurs |
| Développeur | Respect des standards, code testable, revues de code, correction des anomalies |
| Testeur | Conception et exécution des tests (manuels et automatisés), rapports |

---

## 5. Démarche d’assurance qualité

- **Prévention :** Revues (spécifications, code), traçabilité exigences ↔ tests.
- **Détection :** Stratégie de tests (voir section 9), gestion des anomalies (section 8).
- **Amélioration :** Analyse des défauts récurrents, retours d’expérience, mise à jour du PAQ.

---

## 6. Gestion des exigences

- **Fonctionnelles :** User stories / cas d’usage (Visiteur, Client, Admin) et règles métier :
  - Client authentifié pour passer commande.
  - Quantité commandée ≤ stock disponible.
  - Commande validée = définitive.
  - Produit supprimé = non affiché au catalogue.
  - Commande validée = impact sur le stock.
- **Non fonctionnelles :** Sécurité (auth JWT), maintenabilité (modularité, tests).
- **Traçabilité :** Exigences identifiées → au moins un cas de test (idéalement automatisé).

---

## 7. Standards de développement

- **Backend (Java/Spring Boot) :** Conventions de nommage, structure packages, validation (Bean Validation), gestion d’erreurs (GlobalExceptionHandler).
- **Frontend (React/TypeScript) :** Composants fonctionnels, hooks, structure dossiers (pages, components, api, context).
- **Outils :** Analyse statique (ex. SonarLint), formatage cohérent.

---

## 8. Gestion des anomalies

- **Procédure :** Enregistrement (titre, gravité, reproductibilité, lien exigence), attribution, correction, re-test, clôture.
- **Support :** Suivi via issues (ex. GitHub Issues) ou tableau de bord projet.
- **Revues :** Code (pull requests), rapports de test avant livraison.

---

## 9. Stratégie de tests

### 9.1 Backend (Spring Boot)

| Type | Outil / cadre | Objectif |
|------|----------------|----------|
| **Unitaires** | JUnit 5, Mockito | Logique métier (services : Product, Cart, Order, Auth) |
| **Intégration** | Spring Boot Test, MockMvc | Contrôleurs (auth, products, cart, orders, admin) |
| **Couverture** | JaCoCo | Objectif : couverture ≥ 75 % |

### 9.2 Frontend (React)

| Type | Outil | Objectif |
|------|--------|----------|
| **Unitaires / composants** | Vitest, React Testing Library | Pages et contextes (ex. Home, AuthContext) |

### 9.3 Exécution

- **Backend :** `mvn clean test` (Surefire pour unitaires, rapports JaCoCo).
- **Frontend :** `npm run test` (Vitest).
- **CI (recommandé) :** Pipeline (ex. GitHub Actions) : build + tests + couverture.

---

## 10. Indicateurs qualité

- **Taux de couverture des tests** (backend) ≥ 75 %.
- **Nombre de défauts critiques / bloquants** (suivi dans la gestion des anomalies).
- **Taux de réussite des tests** (automatisés).
- **Respect des standards** (analyse statique, revues de code).
- **Traçabilité :** % d’exigences couvertes par au moins un test.

---

## 11. Audits et revues qualité

- **Revues :** Spécifications, code (pull requests), plan de tests, rapports de test.
- **Audits internes :** Conformité au PAQ, respect des procédures (anomalies, revues, indicateurs).
- **Bilans qualité :** En fin de sprint ou de livraison (indicateurs + actions correctives/préventives).

---

*Document opérationnel du projet E-Commerce — AQL.*
