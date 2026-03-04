# Liaison Frontend ↔ Backend

Le client API (`src/api/client.ts`) appelle le backend via l’URL de base `/api`, proxifiée en dev vers `http://localhost:8080/api` (voir `vite.config.ts`).

## Correspondance des appels

| Module frontend | Méthode | Backend (Swagger) |
|-----------------|---------|-------------------|
| **auth** | `login(username, password)` | `POST /auth/login` |
| **auth** | `register(username, email, password)` | `POST /auth/register` |
| **products** | `list(page, size, search?, categoryId?)` | `GET /products` |
| **products** | `getById(id)` | `GET /products/{id}` |
| **categories** | `list()` | `GET /categories` |
| **cart** | `get()` | `GET /cart` |
| **cart** | `addItem(productId, quantity)` | `POST /cart/items` |
| **cart** | `updateItem(productId, quantity)` | `PUT /cart/items/{productId}` |
| **cart** | `removeItem(productId)` | `DELETE /cart/items/{productId}` |
| **cart** | `clear()` | `DELETE /cart` |
| **orders** | `create(items)` | `POST /orders` |
| **orders** | `confirm(orderId)` | `POST /orders/{orderId}/confirm` |
| **orders** | `myOrders()` | `GET /orders` |
| **orders** | `getById(id)` | `GET /orders/{id}` |
| **admin.products** | `list`, `getById`, `create`, `update`, `delete`, `updateStock` | `GET/POST/PUT/DELETE/PATCH /admin/products` |
| **admin.categories** | `list`, `create`, `update`, `delete` | `GET/POST/PUT/DELETE /admin/categories` |
| **admin.orders** | `list`, `getById`, `updateStatus` | `GET/PATCH /admin/orders` |

**Documentation interactive :** ouvrir le lien « API Docs (Swagger) » dans le pied de page, ou aller sur `http://localhost:8080/api/swagger-ui/index.html` (avec le backend démarré).
