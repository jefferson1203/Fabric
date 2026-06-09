# Guide Technique — Microsoft Fabric Guide Ultime 2026

Ce guide détaille l'architecture et l'implémentation de l'application de préparation aux certifications Microsoft Fabric (DP-600 et DP-700).

## Architecture Globale

L'application est une Single Page Application (SPA) construite avec **React 19** et **Vite**. Elle adopte une mise en page moderne en deux colonnes (grille responsive) :
- **Colonne de gauche (Contenu principal) :** Affiche la section courante sélectionnée ou le tableau de bord principal.
- **Colonne de droite (Barre latérale) :** Navigation sticky par groupes thématiques (Sécurité, Gouvernance, Architecture, Performance, Examens).

### Fichiers clés du projet
- `src/main.jsx` : Point d'entrée de l'application React.
- `src/App.jsx` : Contient toute la logique applicative, le Quiz Hub, les questions, la gestion d'état globale et la structure des sections.
- `src/App.css` : Contient les règles de styles globaux, les transitions fluides et la mise en page responsive.
- `src/index.css` : Réinitialisation CSS de base et définition des polices globales.

---

## Logique Applicative & Composants

L'application utilise un ensemble de composants utilitaires légers et optimisés :

### 1. Structure de Données des Questions (`ALL_QUESTIONS`)
Toutes les questions du quiz suivent une interface uniforme :
```typescript
interface Question {
  id: number;
  category: string;      // Sécurité | Architecture | Delta & Perf | etc.
  diff: string;          // Facile | Moyen | Difficile | Expert
  difficulty: string;
  color: string;         // green | amber | red | purple (style CSS)
  tag?: string;          // Tag technique optionnel (ex: CLS, RLS, TMDL)
  q: string;             // Énoncé de la question
  question: string;
  opts: string[];        // Options de réponse (A, B, C, D)
  options: string[];
  ans: number;           // Index de la bonne réponse (0-3)
  answer: number;
  exp: string;           // Explication détaillée
  explanation: string;
  code?: string;         // Extrait de code optionnel (SQL, DAX, PySpark)
}
```

### 2. Gestion de l'état du Quiz Hub
Le composant `QuizHub` pilote un état local pour assurer le suivi de la progression et des scores :
- `selectedCat` : Gère la catégorie filtrée (Tous, Sécurité, Architecture, etc.).
- `answers` : Dictionnaire indexé par `q.id` stockant la sélection utilisateur et l'état de validation :
  ```javascript
  {
    [questionId]: {
      selected: number, // Index de l'option choisie
      revealed: boolean // Indique si la réponse a été affichée
    }
  }
  ```

---

## Guide d'Entretien et Maintenance

### Ajouter de nouveaux chapitres ou sections
Pour ajouter une nouvelle section à l'application :
1. Déclarez la section dans le tableau `SECTIONS` en haut de `src/App.jsx` :
   ```javascript
   { id: "nom_section", label: "Nom Affiché", group: "groupe_destination" }
   ```
2. Ajoutez le rendu HTML/JSX correspondant dans le dictionnaire `_SECTIONS_DATA` à la fin de `src/App.jsx` :
   ```javascript
   _SECTIONS_DATA["nom_section"] = (
     <div>
       <SectionTitle>Nom de la Section</SectionTitle>
       <Card title="Sous-section">
         <p>Contenu textuel...</p>
       </Card>
     </div>
   );
   ```

### Ajouter des questions au Quiz Hub
Ajoutez simplement un nouvel objet à la fin du tableau `ALL_QUESTIONS` dans `src/App.jsx` en respectant le format décrit plus haut. Il sera automatiquement indexé, catégorisé et intégré au tableau de bord des scores en direct.
