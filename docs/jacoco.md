
Here’s JaCoCo as a visual workflow.

---

## 1. End-to-end flow (when you run tests)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  YOU RUN:  mvn test                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: PREPARE-AGENT (before tests)                                           │
│  • Maven starts the JVM that will run your tests.                                │
│  • jacoco-maven-plugin injects the JaCoCo agent: -javaagent:jacocoagent.jar      │
│  • That agent will “watch” every .class loaded by the JVM.                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: TESTS RUN                                                              │
│  • JVM loads your app classes (e.g. AuthService, ProductService) + test classes.│
│  • JaCoCo agent instruments them in memory: adds tiny probes at branch/line level.│
│  • When a line or branch executes → probe fires → counter incremented.           │
│  • All counters are written to:  target/jacoco.exec  (binary file).              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: REPORT (after tests, same “test” phase)                                │
│  • Plugin reads  target/jacoco.exec  + your  target/classes/*.class  (source).   │
│  • Applies <excludes>: ignores DTO, entity, controller, main, JwtAuthFilter.      │
│  • Generates HTML (and optionally XML/CSV) in  target/site/jacoco/               │
│  • You open  target/site/jacoco/index.html  → see coverage per package/class.    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. What “instrumentation” means (conceptually)

```
  YOUR COMPILED CLASS                    IN MEMORY (when tests run)
  ───────────────────                   ───────────────────────────
  AuthService.class          ──►        JaCoCo agent adds probes (counters)
       │                                    │
       │  line 50: if (exists)               │  line 50: probe A ──► hit?
       │  line 51:   throw...                │  line 51: probe B ──► hit?
       │  line 52: save(user)                │  line 52: probe C ──► hit?
       │                                    │
       └────────────────────────────────────┘
                    Execution data (which probes fired)
                    is written to  jacoco.exec
```

So: same bytecode, but at runtime the agent tracks which parts run; that tracking is what ends up in `jacoco.exec`.

---

## 3. Data flow (files and steps)

```
  ┌──────────────┐     compile      ┌──────────────────┐
  │  .java       │ ───────────────► │  .class          │
  │  (source)    │                  │  (bytecode)      │
  └──────────────┘                  └────────┬─────────┘
                                             │
  ┌──────────────┐     run tests     │       │  JVM loads classes
  │  *Test.java  │ ─────────────────┼───────►  + JaCoCo agent
  │  (JUnit)     │                  │       │  instruments on the fly
  └──────────────┘                  │       │
                                    │       ▼
                                    │  ┌──────────────┐
                                    │  │ jacoco.exec │  (binary: who was hit)
                                    │  └──────┬──────┘
                                    │         │
                                    │         │  report goal
                                    │         ▼
                                    │  ┌──────────────┐
                                    └──│ .class      │
                                       │ (again,     │
                                       │ for mapping)│
                                       └──────┬──────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │ HTML / XML   │  (target/site/jacoco/)
                                       │ coverage     │
                                       │ report       │
                                       └──────────────┘
```

So: **source → class → tests run with agent → jacoco.exec → report goal uses .class + exec → report**.

---

## 4. In your project: what is included vs excluded

```
  jacoco.exec (raw data for ALL classes)
         │
         │  report step applies <excludes>
         ▼
  ┌─────────────────────────────────────────────────────────┐
  │  EXCLUDED (not in coverage %)                            │
  │  • com.ecommerce.dto.**                                  │
  │  • com.ecommerce.entity.**                               │
  │  • com.ecommerce.controller.**                           │
  │  • EcommerceApplication.class                            │
  │  • JwtAuthenticationFilter.class                         │
  └─────────────────────────────────────────────────────────┘
         │
         │  rest is INCLUDED
         ▼
  ┌─────────────────────────────────────────────────────────┐
  │  INCLUDED (coverage measured)                            │
  │  • config (SecurityConfig, DataInitializer, …)           │
  │  • security (JwtTokenProvider, CustomUserDetailsService)  │
  │  • service (AuthService, CartService, ProductService, …)  │
  │  • repository (if any logic beyond interface)            │
  └─────────────────────────────────────────────────────────┘
```

So the “visual workflow” for JaCoCo in your app is: **run tests → agent records hits into jacoco.exec → report step excludes DTO/entity/controller/main/filter → you see coverage only for the included packages (config, security, service, etc.)**.