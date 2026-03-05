
Here’s how the project is structured and how the main flows work, with simple visual workflows.

---

## 1. Project layout

The app is a **React (Vite) frontend** talking to a **Spring Boot backend** over HTTP. The backend is under `/api` (context path).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Frontend (Vite/React, port 5173)                                            │
│  • AuthContext → login/register, token & user in state + localStorage         │
│  • api/client.ts → fetch to /api/* with Bearer token                         │
│  • Vite proxy: /api → http://localhost:8081                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Backend (Spring Boot, port 8081, context-path: /api)                        │
│  • SecurityConfig: public vs protected routes, JWT filter                    │
│  • JwtAuthenticationFilter → extract Bearer → validate → set SecurityContext  │
│  • AuthController → /auth/register, /auth/login → AuthService → JWT          │
│  • Other controllers: products, cart, orders, admin...                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Auth workflow

### Register

```mermaid
sequenceDiagram
  participant User
  participant LoginPage
  participant AuthContext
  participant client
  participant AuthController
  participant AuthService
  participant DB
  participant JwtTokenProviderService

  User->>LoginPage: submit register form
  LoginPage->>AuthContext: register(username, email, password)
  AuthContext->>client: POST /api/auth/register
  client->>AuthController: POST /auth/register (no token)
  AuthController->>AuthService: register(request)
  AuthService->>AuthService: existsByUsername? existsByEmail?
  AuthService->>DB: save User (encoded password, Role.CLIENT)
  AuthService->>AuthService: cartService.createCartForUser(user)
  AuthService->>JwtTokenProviderService: generateToken(username, userId)
  JwtTokenProviderService-->>AuthService: JWT string
  AuthService-->>AuthController: AuthResponse(token, username, role, userId)
  AuthController-->>client: 200 + JSON
  client-->>AuthContext: { token, username, role, userId }
  AuthContext->>AuthContext: setToken/setUser, localStorage
  AuthContext-->>LoginPage: done → redirect/navigate
```

- **Backend:** `AuthController.register` → `AuthService.register`: validate uniqueness, save user, create cart, generate JWT, return `AuthResponse`.
- **Frontend:** `AuthContext.register` calls `authApi.register` (in `client.ts`), then stores token and user in state and `localStorage`.

### Login

```mermaid
sequenceDiagram
  participant User
  participant LoginPage
  participant AuthContext
  participant client
  participant AuthController
  participant AuthService
  participant AuthManager
  participant UserDetailsService
  participant JwtTokenProviderService

  User->>LoginPage: submit login form
  LoginPage->>AuthContext: login(username, password)
  AuthContext->>client: POST /api/auth/login
  client->>AuthController: POST /auth/login
  AuthController->>AuthService: login(request)
  AuthService->>AuthManager: authenticate(UsernamePasswordAuthenticationToken)
  AuthManager->>UserDetailsService: loadUserByUsername
  UserDetailsService-->>AuthManager: UserPrincipal
  AuthManager->>AuthManager: check password (PasswordEncoder)
  AuthManager-->>AuthService: Authentication(principal)
  AuthService->>JwtTokenProviderService: generateToken(username, userId)
  AuthService-->>AuthController: AuthResponse
  AuthController-->>client: 200 + { token, username, role, userId }
  client-->>AuthContext: response
  AuthContext->>AuthContext: setToken/setUser, localStorage
```

- **Backend:** `AuthController.login` → `AuthService.login` → `AuthenticationManager` (with `UserDetailsService` + `PasswordEncoder`) → on success, build JWT via `JwtTokenProviderService` and return `AuthResponse`.
- **Frontend:** Same as register: `AuthContext.login` → `authApi.login` → store token and user.

### Authenticated request (any protected API)

```mermaid
sequenceDiagram
  participant Page
  participant client
  participant Backend
  participant JwtAuthFilter
  participant UserDetailsService
  participant Controller

  Page->>client: api('/cart') or products.addItem(...)
  client->>client: getToken() from localStorage
  client->>Backend: GET/POST /api/... + Header: Authorization: Bearer <jwt>
  Backend->>JwtAuthFilter: request
  JwtAuthFilter->>JwtAuthFilter: getJwtFromRequest (Bearer substring)
  JwtAuthFilter->>JwtAuthFilter: tokenProvider.validateToken(jwt)
  JwtAuthFilter->>JwtAuthFilter: getUsernameFromToken(jwt)
  JwtAuthFilter->>UserDetailsService: loadUserByUsername(username)
  UserDetailsService-->>JwtAuthFilter: UserDetails
  JwtAuthFilter->>JwtAuthFilter: new UsernamePasswordAuthenticationToken(..., authorities)
  JwtAuthFilter->>JwtAuthFilter: SecurityContextHolder.getContext().setAuthentication(...)
  JwtAuthFilter->>Controller: filterChain.doFilter → controller method
  Controller-->>client: response
  client-->>Page: data
```

- **Frontend:** `api()` in `client.ts` always adds `Authorization: Bearer <token>` when `localStorage.token` exists.
- **Backend:** Every request goes through `JwtAuthenticationFilter`: read Bearer token → validate JWT → load user → set `SecurityContext` → rest of the chain (controllers) see the authenticated user.

So: **auth** = register/login return JWT; **later calls** = client sends JWT; **backend** = filter validates JWT and sets Spring Security context.

---

## 3. Security and request routing (backend)

```mermaid
flowchart LR
  subgraph Incoming
    R[HTTP Request]
  end
  subgraph Spring Security
    SC[SecurityFilterChain]
    JAF[JwtAuthenticationFilter]
    UPA[UsernamePasswordAuthenticationFilter]
  end
  subgraph Rules
    P1["/auth/** → permitAll"]
    P2["/products/** , /categories/** → permitAll"]
    P3["/admin/** → hasRole(ADMIN)"]
    P4["/cart/** , /orders/** , /profile/** → hasRole(CLIENT|ADMIN)"]
  end
  R --> SC
  SC --> JAF
  JAF --> UPA
  SC --> P1
  SC --> P2
  SC --> P3
  SC --> P4
```

- **SecurityConfig** builds the chain: CSRF disabled, stateless session, CORS, then route rules.
- **JwtAuthenticationFilter** runs first: if there’s a valid Bearer JWT, it sets `SecurityContext`; if not, the context stays empty.
- **Route rules:**  
  - `/auth/**`, `/products/**`, `/categories/**` → no auth.  
  - `/admin/**` → must have role ADMIN.  
  - `/cart/**`, `/orders/**`, `/profile/**` → must have CLIENT or ADMIN.

So “how auth works” in practice: **auth endpoints** are public; **protected endpoints** require a valid JWT that the filter has turned into an `Authentication` in `SecurityContext`.

---

## 4. Tests

### Backend (Java)

- **Unit tests (Mockito):** one class under test, dependencies mocked.  
  Example: `AuthServiceTest` mocks `UserRepository`, `PasswordEncoder`, `AuthenticationManager`, `JwtTokenProviderService`, `CartService` and checks `register`/`login` return values and thrown exceptions.

```mermaid
flowchart LR
  subgraph AuthServiceTest
    A[AuthService]
    M1[UserRepository mock]
    M2[PasswordEncoder mock]
    M3[AuthManager mock]
    M4[JwtTokenProviderService mock]
    M5[CartService mock]
  end
  A --> M1
  A --> M2
  A --> M3
  A --> M4
  A --> M5
```

- **Integration tests (MockMvc + SpringBootTest):** full context, real (or test) DB, HTTP layer.  
  Example: `AuthControllerIT` calls `POST /api/auth/register` and `POST /api/auth/login` and asserts status and JSON (e.g. `token`, `username`, `role`).

```mermaid
flowchart LR
  T[AuthControllerIT] --> M[MockMvc]
  M --> F[DispatcherServlet]
  F --> C[AuthController]
  C --> S[AuthService]
  S --> DB[(DB / Test)]
```

So: **auth** is tested at service level (unit) and at HTTP level (integration). Other areas (products, cart, orders, etc.) follow the same pattern (unit for services, IT for controllers if present).

### Frontend (Vitest + React Testing Library)

- **Vitest** runs tests; **React Testing Library** renders components and queries the DOM.
- Example: `AuthContext.test.tsx` renders `AuthProvider` and a consumer that reads `user` from `useAuth()`, and asserts initial state (e.g. `user` null or “none”).
- `Home.test.tsx` and similar files test pages in isolation (and can mock `useAuth` or API if needed).

```mermaid
flowchart LR
  Vitest --> RTL[React Testing Library]
  RTL --> Render[render(Component)]
  Render --> Screen[screen queries]
  Screen --> Expect[expect(...)]
```

So: **tests** on the frontend are component/context tests with Vitest and RTL; they don’t call the real backend (you’d mock `authApi` or `api` for that).

---

## 5. End-to-end flow (one example: “add to cart”)

```mermaid
sequenceDiagram
  participant User
  participant ProductDetail
  participant AuthContext
  participant client
  participant JwtAuthFilter
  participant PanierController

  User->>ProductDetail: click Add to cart
  ProductDetail->>AuthContext: useAuth().token (or redirect to login if none)
  ProductDetail->>client: cart.addItem(productId, quantity)
  client->>client: getToken(), headers['Authorization'] = Bearer ...
  client->>JwtAuthFilter: POST /api/cart/items?productId=...&quantity=...
  JwtAuthFilter->>JwtAuthFilter: validate JWT, set SecurityContext
  JwtAuthFilter->>PanierController: addItem(...)
  PanierController-->>client: 200 + Cart
  client-->>ProductDetail: updated cart / success
```

- **Auth:** If the user is logged in, `AuthContext` holds the token and `client` sends it; if not, the app can redirect to login (e.g. via `PrivateRoute` for `/cart`).
- **Backend:** Only the JWT filter and controller are in play; no separate “auth” call for this request.

---

## Summary

| Area | How it works |
|------|----------------|
| **Auth** | Register/Login via `AuthController` → `AuthService` → JWT from `JwtTokenProvider`/`JwtTokenProviderService`. Frontend stores token and user in `AuthContext` and `localStorage`. |
| **Protected calls** | `client.ts` adds `Authorization: Bearer <token>`. `JwtAuthenticationFilter` validates JWT, loads user, sets `SecurityContext`. Routes are enforced by `SecurityConfig` (roles). |
| **Tests** | Backend: unit tests (services with mocks), integration tests (MockMvc vs `/api/...`). Frontend: Vitest + RTL for components and context. |

If you tell me which part you want to go deeper into (e.g. only auth, only tests, or a specific file), I can stick to that and keep the same visual style.