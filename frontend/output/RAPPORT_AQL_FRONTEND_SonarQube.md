# Rapport d’assurance qualité logicielle — Module frontend  
## Analyse statique et suivi des indicateurs (SonarQube)

**Contexte :** travail réalisé dans le cadre d’un module d’**assurance de la qualité logicielle** à l’université.  
**Périmètre :** application **e-commerce — partie frontend** (`ecommerce-frontend`).  
**Sources de données :** exports CSV générés à partir du serveur SonarQube :

- `rapport-sonar-metrics.csv` — instantané des métriques projet ;
- `rapport-sonar-metrics-history.csv` — historique des métriques suivies dans le temps ;
- `rapport-sonar-issues.csv` — détail des anomalies (issues) remontées par l’analyseur.

**Date de référence des métriques :** 27 mars 2026 (dernier état reflété dans les CSV).

---

## 1. Introduction

### 1.1 Objectif du rapport

Ce document présente une **synthèse académique** des résultats d’analyse de code du frontend : taille, complexité, dette technique, couverture de tests, sécurité, fiabilité, et liste des problèmes détectés. L’objectif est de **documenter l’état de la qualité** du logiciel, d’**interpréter** les indicateurs et de **proposer des pistes d’amélioration** alignées avec les bonnes pratiques d’ingénierie logicielle.

### 1.2 Méthodologie

L’outil **SonarQube** effectue une **analyse statique** du code source (TypeScript/JavaScript, HTML/CSS selon configuration). Les métriques et issues sont agrégées au niveau du composant projet. Les fichiers CSV utilisés ici constituent une **trace reproductible** des résultats au moment de l’analyse.

*Note :* le fichier `rapport-sonar-issues.csv` contient également un **historique d’issues** (dont beaucoup **fermées** après correction ou reconfiguration), ce qui explique un volume de lignes bien supérieur au nombre d’issues **ouvertes** actuellement pris en compte dans le tableau de bord (voir section 4).

---

## 2. Synthèse exécutive

| Domaine | Synthèse |
|--------|----------|
| **Taille** | 3 205 lignes de code (NCLOC), complexité cyclomatique totale **465**. |
| **Fiabilité** | **1 bug** ouvert ; note de fiabilité **B** (rating 2.0). |
| **Sécurité** | **1 vulnérabilité** ouverte, **1 point sensible** (security hotspot) ; **note de sécurité E** (rating 5.0) — priorité à traiter. |
| **Maintenabilité** | **30 code smells** ouverts ; dette technique estimée **142 min**, ratio **0,1 %**. |
| **Tests** | Couverture **53,8 %** ; **890** lignes à couvrir, **445** non couvertes. |
| **Duplication** | **0 %** de lignes dupliquées (densité), **0** bloc dupliqué. |
| **Documentation inline** | Densité de commentaires **0,8 %** (faible). |

**Conclusion provisoire :** le projet présente une **base de code de taille raisonnable**, une **duplication maîtrisée**, et une **couverture de tests en progression** mais encore **sous les seuils souvent visés en industrie (≥ 80 %)**. En revanche, la **sécurité** et un **bug** restent des **points d’attention immédiats**.

---

## 3. Analyse détaillée des métriques instantanées

Les valeurs ci-dessous proviennent de `rapport-sonar-metrics.csv`.

### 3.1 Taille et structure

| Métrique | Valeur | Interprétation |
|----------|--------|----------------|
| `ncloc` | 3 205 | Volume fonctionnel du code (hors commentaires/blancs significatifs). |
| `complexity` | 465 | Complexité cyclomatique cumulée ; à surveiller sur les modules les plus denses. |
| `comment_lines_density` | 0,8 % | Peu de commentaires explicatifs ; la lisibilité repose surtout sur le nommage et la structure. |

### 3.2 Qualité intrinsèque (bugs, smells, dette)

| Métrique | Valeur | Interprétation |
|----------|--------|----------------|
| `bugs` | 1 | Au moins un défaut potentiel de comportement à corriger. |
| `code_smells` | 30 | Améliorations de style, conception ou bonnes pratiques. |
| `vulnerabilities` | 1 | Risque de sécurité identifié par les règles SonarQube. |
| `violations` | 32 | Total cohérent avec la somme des problèmes ouverts suivis (voir issues). |
| `sqale_index` | 142 min | Effort estimé pour « rembourser » la dette technique. |
| `sqale_debt_ratio` | 0,1 % | Dette faible par rapport à la taille du code. |
| `reliability_rating` | 2,0 | **B** — bon niveau global de fiabilité, sous réserve de corriger le bug ouvert. |
| `security_rating` | 5,0 | **E** — niveau le plus critique sur l’échelle Sonar ; **action prioritaire** sur la sécurité. |
| `security_hotspots` | 1 | Zone à revue manuelle pour confirmer ou infirmer un risque. |

### 3.3 Tests et couverture

| Métrique | Valeur | Interprétation |
|----------|--------|----------------|
| `coverage` | 53,8 % | Environ la moitié du code « couvert » par les tests automatisés. |
| `lines_to_cover` | 890 | Volume de code concerné par la mesure de couverture. |
| `uncovered_lines` | 445 | Cible prioritaire pour étendre les tests. |

### 3.4 Duplication

| Métrique | Valeur |
|----------|--------|
| `duplicated_lines_density` | 0,0 % |
| `duplicated_blocks` | 0 |

**Interprétation :** absence de duplication détectée aux seuils de l’outil — point **positif** pour la maintenabilité.

---

## 4. Analyse des issues (`rapport-sonar-issues.csv`)

### 4.1 Volume global

- **Total d’enregistrements d’issues** dans le CSV : **3 933** (hors ligne d’en-tête), incluant l’historique (issues **CLOSED** et **OPEN**).
- **Issues actuellement ouvertes (OPEN)** : **32**, en cohérence avec la métrique `violations` = 32.

### 4.2 Répartition des 32 issues ouvertes par sévérité

| Sévérité | Nombre |
|----------|--------|
| **BLOCKER** | 1 |
| **MAJOR** | 10 |
| **MINOR** | 21 |

### 4.3 Répartition par type SonarQube

| Type | Nombre |
|------|--------|
| CODE_SMELL | 30 |
| VULNERABILITY | 1 |
| BUG | 1 |

### 4.4 Règles les plus fréquentes (issues ouvertes)

Les règles suivantes apparaissent le plus souvent parmi les issues **OPEN** (extrait significatif) :

| Règle | Occurrences | Thème typique |
|-------|-------------|----------------|
| `typescript:S6759` | 11 | Props de composants React à marquer en lecture seule (`readonly`). |
| `typescript:S7763` | 7 | Préférer `export … from` pour les réexports de modules. |
| `typescript:S3358` | 3 | Simplifier des expressions conditionnelles imbriquées. |
| `typescript:S6557` | 3 | Ajustements TypeScript sur les promesses / async. |
| `typescript:S1128` | 2 | Imports inutilisés à supprimer. |
| `secrets:S6702` | 1 | **Revues liées aux secrets** (sensibilité sécurité — à traiter en priorité avec la vulnérabilité). |

*Les libellés exacts des règles sont disponibles dans l’interface SonarQube ; le CSV liste la clé de règle et le message par issue.*

### 4.5 Issues historiques (fermées)

La majorité des lignes du CSV correspondent à des issues **CLOSED** (anomalies corrigées ou analyses passées incluant notamment des artefacts sous `coverage/`). Cela illustre l’**évolution** du projet et la **capacité à résorber** de la dette, mais ne reflète pas l’état actuel du tableau de bord pour la **qualité du code applicatif** seul.

---

## 5. Évolution temporelle (`rapport-sonar-metrics-history.csv`)

L’historique disponible couvre une fenêtre récente (26–27 mars 2026) pour les métriques : `bugs`, `code_smells`, `coverage`, `vulnerabilities`.

### 5.1 Faits marquants

- **Bugs :** passage transitoire à **25** sur un instantané du 26/03, puis **retour à 1** — indique une **instabilité ponctuelle** (branche, périmètre d’analyse ou fusion) puis stabilisation.
- **Code smells :** pic très élevé (**3896**) sur un point du 26/03, puis valeurs basses (**26–30**) ensuite — **cohérent avec une analyse ayant inclus des fichiers non représentatifs** (ex. générés) avant filtrage ; les valeurs récentes (**30**) sont alignées avec le tableau de bord actuel.
- **Couverture :** de **0 %** à **53,8 %** sur la période — **progression nette** une fois les rapports de couverture pris en compte par SonarQube.
- **Vulnérabilités :** stable à **1** sur la période — **non résolue** à ce stade.

### 5.2 Lecture pédagogique

Ce type de courbe montre l’importance de **conditions d’analyse stables** (même branche, mêmes exclusions, rapport LCOV à jour) pour comparer les versions dans le temps.

---

## 6. Risques et priorités

1. **Sécurité (note E, vulnérabilité + hotspot + règle `secrets:S6702`)** — analyser en équipe, corriger ou justifier, puis **revue de code** ciblée.  
2. **Bug ouvert** — reproduction, test de non-régression, correction.  
3. **Issue BLOCKER** — traitement **immédiat** selon la politique qualité du module.  
4. **Couverture ~54 %** — planifier des tests sur les chemins critiques (authentification, panier, commande, erreurs API).  
5. **Dette « smells » TypeScript/React** — corrections **par lots** (réexports, `readonly`, nettoyage d’imports) pour réduire le bruit dans SonarQube.

---

## 7. Plan d’actions recommandé (équipe de 3 étudiants)

| Priorité | Action | Livrable |
|----------|--------|----------|
| P0 | Atelier sécurité : vulnérabilité, hotspot, règle secrets | Correctif ou rapport de justification + nouvelle analyse Sonar |
| P0 | Corriger le bug et l’issue BLOCKER | PR + tests |
| P1 | Uniformiser les réexports (`S7763`) et props (`S6759`) | PRs thématiques par dossier (`api`, `components`, …) |
| P2 | Augmenter la couverture (cible intermédiaire **65 %** puis **80 %**) | Rapport de couverture + nouveaux tests |
| P3 | Documenter les modules complexes (commentaires ciblés) | Révision `comment_lines_density` |

Répartition possible : **étudiant A** — sécurité et secrets ; **étudiant B** — bugs et tests ; **étudiant C** — smells TypeScript/React et duplication de configuration d’analyse.

---

## 8. Conclusion

Les CSV SonarQube décrivent un **frontend structuré** (faible duplication, dette relativement faible) avec une **couverture de tests en amélioration continue** mais encore **insuffisante** pour les standards industriels exigeants. Les **points critiques** sont **sécurité** (note E, vulnérabilité persistante) et la **résolution du bug** et du **BLOCKER**. La poursuite des **bonnes pratiques TypeScript/React** (issues `S6759`, `S7763`, etc.) permettra de stabiliser la qualité **maintenabilité** sans alourdir excessivement la charge.

Ce rapport peut être **joint** à une présentation orale en citant explicitement les **fichiers sources CSV** et la **date d’analyse**, et en rappelant que la qualité est un **processus itératif** mesuré par des outils mais **validé** par des revues humaines et des tests.

---

## Annexes

### A. Correspondance indicative des ratings SonarQube (rappel)

- **Fiabilité / sécurité / maintenabilité :** échelle **1 (A)** à **5 (E)** ; **1** = meilleur niveau selon les règles du produit.

### B. Fichiers de données

- `rapport-sonar-metrics.csv`  
- `rapport-sonar-metrics-history.csv`  
- `rapport-sonar-issues.csv`  

### C. Références bibliographiques indicatives

- ISO/IEC 25010 — *Systems and software Quality Requirements and Evaluation (SQuaRE)* — modèle de qualité du produit logiciel.  
- Documentation SonarQube — *Metrics definitions* et *Security* (selon version utilisée en cours).  
- Cours d’assurance qualité logicielle — méthodes de revue statique et dynamique.

---

*Document rédigé pour un usage pédagogique — à compléter par les noms des étudiants, l’intitulé exact du cours, l’enseignant référent et la date de remise.*
