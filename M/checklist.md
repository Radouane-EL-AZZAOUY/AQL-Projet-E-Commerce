


| Catégorie             | Point vérifié                                                  | Commentaires / Observations                                                                            | Responsable | ✔   |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------- | --- |
| **Structure du code** | Lisibilité, indentation, séparation logique des modules        | Structure globalement claire, quelques fichiers un peu longs à refactorer                              |             | OK  |
|                       | Nommage cohérent des variables, fonctions et classes           | Nommage globalement cohérent, quelques abréviations peu parlantes à renommer                           |             | OK  |
| **Commentaires**      | Clarté et pertinence des commentaires                          | R1+R2+R5 (il y a des commentaires qui ne sont pas clairs) / et dans la plupart du temps sont manquants |             | KO  |
|                       | Documentation des fonctions (paramètres, retour, comportement) | Documentation rarement présente, à compléter surtout pour les services et contrôleurs                  |             | KO  |
|                       | Pas de commentaires redondants ou inutiles                     | Peu de commentaires superflus, ceux présents apportent généralement de la valeur                       |             | OK  |



| Catégorie                     | Point vérifié                                                                            | Commentaires / Observations                                                              | Responsable | ✔   |
| ----------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------- | --- |
| **Références aux données**    | Variables bien définies et manipulées correctement                                       | Types bien choisis, peu de conversions implicites, quelques champs à mieux valider       |             | OK  |
|                               | Sources externes documentées et intégrées correctement (API, fichiers, bases de données) | Connexions à la base correctes mais manque de documentation sur la config et les schémas |             | KO  |
| **Calculs et décisions**      | Précision des algorithmes, vérification des cas limites                                  | Cas nominaux bien gérés, peu de tests/cas sur les valeurs extrêmes ou erreurs            |             | KO  |
|                               | Cohérence des structures conditionnelles et validité des conditions logiques             | Logique correcte dans l’ensemble, quelques conditions complexes à simplifier             |             | OK  |
| **Définition des constantes** | Constantes définies explicitement, utilisation à la place de valeurs magiques            | Présence de plusieurs valeurs magiques (seuils, messages) à extraire en constantes       |             | KO  |



| Catégorie                   | Point vérifié                                                           | Commentaires / Observations                                                              | Responsable | ✔   |
| --------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------- | --- |
| **Comparaisons**            | Types corrects, conditions logiques valides, gestion des valeurs nulles | Comparaisons correctes mais gestion des `null`/vides incomplète à certains endroits      |             | KO  |
| **Contrôle des erreurs**    | Gestion des exceptions (try/catch, retours d’erreurs)                   | Exceptions globalement capturées côté contrôleur, manque de messages d’erreurs détaillés |             | KO  |
|                             | Validation des entrées utilisateur                                      | Validation partielle (front) mais contrôles serveur insuffisants sur certains champs     |             | KO  |
| **Taille et modularité**    | Modules et fonctions de taille raisonnable                              | Quelques services et contrôleurs trop volumineux à découper en méthodes/fichiers         |             | KO  |
|                             | Respect du principe de responsabilité unique                            | Certaines classes mélangent logique métier, accès données et présentation                |             | KO  |
| **Règles de programmation** | Respect des conventions et règles définies dans le plan qualité         | Conventions globalement respectées, quelques écarts mineurs (nommage, formatage)         |             | OK  |


