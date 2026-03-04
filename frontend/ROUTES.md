# Routes et liens — Frontend E-Commerce

Avec **HashRouter**, les URLs sont de la forme `http://localhost:5173/#/route`.

## Routes définies (App.tsx)

| Chemin | Page | Accès |
|--------|------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/catalog` | Catalog | Public |
| `/products/:id` | ProductDetail | Public |
| `/cart` | Cart | Client/Admin |
| `/checkout` | Checkout | Client/Admin |
| `/orders` | MyOrders | Client/Admin |
| `/orders/:id` | OrderDetail | Client/Admin |
| `/admin/products` | AdminProducts | Admin |
| `/admin/categories` | AdminCategories | Admin |
| `/admin/orders` | AdminOrders | Admin |
| `*` | → Redirect `/` | — |

## Liens par page

- **Layout** : `/`, `/catalog`, `/cart`, `/orders`, `/admin/products`, `/admin/categories`, `/admin/orders`, `/login`, `/register`
- **Home** : `/catalog`, `/register`
- **Login** : `/register`
- **Register** : `/login`
- **Catalog** : `/products/:id`
- **ProductDetail** : `/catalog`
- **Cart** : `/catalog`, `/checkout`
- **Checkout** : `navigate('/cart')`, `navigate('/orders/:id')`
- **MyOrders** : `/catalog`, `/orders/:id`
- **OrderDetail** : `/orders`

Tous les liens utilisent des chemins relatifs à la racine (ex. `/catalog`). HashRouter les convertit en `#/catalog`.
