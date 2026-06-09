# Microsoft Fabric — Guide d'Étude & Quiz Interactif (DP-600 & DP-700)

Bienvenue sur la plateforme interactive de préparation aux certifications **Microsoft Fabric Analytics Engineer (DP-600)** et **Microsoft Fabric Data Engineer (DP-700)**. 

Cette application Web moderne a été conçue pour centraliser l'apprentissage des concepts théoriques de Microsoft Fabric, proposer des fiches mémo stratégiques et tester vos compétences avec un Quiz Hub interactif complet.

---

## Fonctionnalités principales

- **Vue d'ensemble de la sécurité :** Cours complet sur les trois niveaux de sécurité Fabric (Authentification, Autorisation, Sécurité des données).
- **Sécurité granulaire :** Modules dédiés pour RLS (Row-Level Security), CLS (Column-Level Security), OLS (Object-Level Security) et DDM (Dynamic Data Masking) avec des exemples d'implémentation en T-SQL et DAX.
- **Architecture de données :** Présentation détaillée de l'écosystème OneLake, des raccourcis (Shortcuts), du Mirroring et des bonnes pratiques de modélisation (couches Bronze, Silver, Gold).
- **Maintenance & Performances Delta :** Explications détaillées sur les techniques d'optimisation Delta (V-Order, OPTIMIZE, VACUUM, Z-Order, Liquid Clustering).
- **Quiz Hub interactif unifié :** 
  - Catégorisation des questions (Sécurité, Architecture, Delta/Performance, etc.).
  - Suivi en direct du score global et taux de réussite.
  - Explications approfondies et interactives pour chaque réponse avec affichage de snippets de code.
  - Boutons de réinitialisation individuels ou globaux.

---

## Spécifications techniques

L'application est construite sur une architecture légère et performante :
- **Framework :** React 19 (SPA)
- **Outil de build :** Vite 8
- **Styles :** CSS natif (Design responsive, Glassmorphism, styles harmonieux et professionnels)
- **Linter :** ESLint configuré pour le respect des meilleures pratiques de codage

Pour plus de détails sur le fonctionnement interne de l'application, veuillez consulter le [Guide Technique](docs/guide_technique.md).

---

## Installation et démarrage local

### Prérequis
- [Node.js](https://nodejs.org/) (Version 20 ou supérieure recommandée)
- npm (installé par défaut avec Node.js)

### Démarrage
1. Installez les dépendances du projet :
   ```bash
   npm install
   ```

2. Lancez le serveur de développement local :
   ```bash
   npm run dev
   ```
   L'application sera accessible dans votre navigateur à l'adresse [https://fabric-rho-azure.vercel.app](https://fabric-rho-azure.vercel.app/).

3. Validez la qualité du code (linter) :
   ```bash
   npm run lint
   ```

4. Compilez l'application pour la production :
   ```bash
   npm run build
   ```
   Les fichiers optimisés seront générés dans le dossier `/dist`.
