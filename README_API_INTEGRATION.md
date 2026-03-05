# Intégration API - Questionnaires Dynamiques

## Architecture mise en place

### 📁 Fichiers créés/modifiés

#### Types TypeScript
- `src/types/questionnaire.ts` - Interfaces pour l'API et les questionnaires

#### API Layer
- `src/api/questionnaires.ts` - Service HTTP pour communiquer avec le backend
- `src/services/questionnaireService.ts` - Service métier avec mapping des icônes

#### Store Pinia
- `src/stores/questionnaireStore.ts` - Gestion d'état des questionnaires

#### Pages modifiées
- `src/pages/AuditSelection.vue` - Intégration API + formulaire de contexte
- `src/pages/Questionnaire.vue` - Support des questions dynamiques

#### Configuration
- `.env.example` - Variables d'environnement

## 🔄 Flow utilisateur

1. **Dashboard** → **AuditSelection**
2. Chargement dynamique des référentiels depuis `/api/v1/questionnaires/referentiels/database`
3. Sélection d'un référentiel → ouverture du modal de contexte
4. Formulaire : secteur, taille, niveau estimé
5. Appel API `/api/v1/questionnaires/generate-questionnaire`
6. Redirection vers **Questionnaire** avec les questions dynamiques
7. Support des types : `boolean`, `multi_choice`, `text`

## 🎨 Features implémentées

### AuditSelection.vue
- ✅ Chargement dynamique des référentiels
- ✅ Skeleton loader pendant le chargement
- ✅ Gestion des erreurs avec retry
- ✅ Modal de contexte (secteur, taille, niveau)
- ✅ Préservation des icônes et couleurs côté frontend

### Questionnaire.vue
- ✅ Support des 3 types de questions
- ✅ Questions booléennes : Oui/Non/Partiel/N/A
- ✅ Questions multi-choix : checkboxes dynamiques
- ✅ Questions textes : textarea
- ✅ Validation adaptative par type
- ✅ Préservation du design existant

### Store & Services
- ✅ Gestion d'état centralisée
- ✅ Mapping automatique des icônes
- ✅ Gestion des erreurs
- ✅ Loading states

## 🔧 Configuration

### Variables d'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer selon votre configuration
VITE_API_BASE_URL=http://localhost:8000
```

### Mapping des référentiels
Les icônes et couleurs sont définies dans `src/services/questionnaireService.ts` :

```typescript
export const referentialMeta = {
  "ISO 27001": { icon: "🔒", color: "from-cyan-500 to-blue-600" },
  "RGPD": { icon: "🛡️", color: "from-blue-500 to-indigo-600" },
  "SOC 2": { icon: "✅", color: "from-purple-500 to-pink-600" },
  // ...
}
```

## 🚀 Tests

### Démarrage
```bash
npm run dev
```

### Flow de test
1. Aller sur `/dashboard`
2. Cliquer sur "Nouvel audit"
3. Vérifier le chargement des référentiels
4. Sélectionner un référentiel
5. Remplir le formulaire de contexte
6. Vérifier la génération du questionnaire
7. Répondre aux différentes questions
8. Vérifier la progression et la sauvegarde

## 🐛 Gestion des erreurs

### Erreurs réseau
- Affichage d'un message d'erreur clair
- Bouton de retry pour réessayer
- Fallback vers les données statiques si besoin

### Erreurs de validation
- Validation côté frontend
- Messages d'erreur explicites
- Boutons désactivés si formulaire invalide

## 📝 Notes importantes

- **Le design existant est préservé** ✅
- **Les icônes restent côté frontend** ✅
- **Le flow UX est inchangé** ✅
- **Architecture scalable et maintenable** ✅
- **Code TypeScript strict** ✅

## 🔮 Évolutions possibles

- Cache des référentiels pour optimiser les performances
- Mode offline avec IndexedDB
- Export des résultats en PDF
- Intégration avec un système de SSO
- Notifications de progression en temps réel
