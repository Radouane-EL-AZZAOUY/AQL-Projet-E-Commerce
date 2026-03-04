# E-Commerce — Projet fil rouge AQL

Projet e-commerce (backend Spring Boot + frontend React) réalisé dans le cadre du module **Assurance Qualité Logicielle et Automatisation des Tests**. Il illustre la politique qualité, le PAQ et la stratégie de tests (unitaires, intégration, couverture).

## Structure du projet

- **backend/** — API REST Spring Boot (Java 17), JWT, JPA/H2, tests JUnit 5 + MockMvc, JaCoCo
- **frontend/** — Application React (Vite, TypeScript), tests Vitest + React Testing Library
- **docs/PAQ.md** — Plan d’Assurance Qualité (normes ISO 9001, ISO/IEC 25010, ISO/IEC 29119, IEEE 730)

## Règles métier (fil rouge)

- Un client doit être authentifié pour passer une commande.
- La quantité commandée ne peut pas dépasser le stock disponible.
- Une commande validée est définitive.
- Un produit supprimé ne s’affiche pas dans le catalogue.
- Une commande validée impacte le stock.

## Démarrage

### Backend

```bash
cd backend
mvn spring-boot:run
```

- API : http://localhost:8081/api  
- **Swagger UI** : http://localhost:8081/api/swagger-ui.html (ou via le lien « API Docs » dans le pied de page du frontend)  
- **Comptes de démo (seed) :**
  - Admin : `admin` / `admin123`
  - Client : `client` / `client123`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Application : http://localhost:5173 (proxy `/api` vers backend sur le port 8081)
- Lien direct catalogue : http://localhost:5173/#/catalog (HashRouter pour éviter 404 en dev)

### Tests

**Backend :**
```bash
cd backend
mvn clean test
```
Rapport JaCoCo : `backend/target/site/jacoco/index.html`

**Frontend :**
```bash
cd frontend
npm run test
```

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT (jjwt), JPA/H2, SpringDoc OpenAPI (Swagger) |
| Frontend | React 18, Vite, React Router, TypeScript |
| Tests backend | JUnit 5, Mockito, Spring Boot Test, JaCoCo |
| Tests frontend | Vitest, React Testing Library |

## Références

- PAQ détaillé : [docs/PAQ.md](docs/PAQ.md)
- Normes : ISO 9001, ISO/IEC 25010, ISO/IEC 29119, IEEE 730
