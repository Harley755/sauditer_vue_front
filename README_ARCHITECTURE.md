# Architecture Vue.js - Clean Architecture

## 📋 Vue d'ensemble

Ce projet suit les principes de la Clean Architecture pour une application Vue.js 3 avec TypeScript et Pinia.

## 🏗️ Structure des dossiers

```
src/
├── components/          # Composants Vue réutilisables
├── pages/              # Pages de l'application
├── stores/             # Stores Pinia (gestion d'état)
├── services/           # Services API (couche d'accès aux données)
├── types/              # Définitions de types TypeScript
└── hooks/              # Composables Vue
```

## 🔧 Technologies utilisées

- **Vue 3** avec Composition API
- **TypeScript** pour la sécurité des types
- **Pinia** pour la gestion d'état (remplace Vuex)
- **Vue Router** pour le routing
- **TailwindCSS** pour le styling
- **Lucide Vue** pour les icônes

## 📦 Architecture en couches

### 1. Couche Présentation (Components/Pages)
- Composants Vue réutilisables
- Pages de l'application
- Logique de présentation uniquement

### 2. Couche Métier (Stores)
- Gestion d'état avec Pinia
- Logique métier
- Coordination entre les couches

### 3. Couche Données (Services)
- Appels API centralisés
- Gestion des erreurs
- Transformation des données

### 4. Couche Types (TypeScript)
- Interfaces et types
- Contrats de données
- Validation des structures

## 🔄 Flux de données

```
Component → Store → Service → API
    ↑         ↓         ↓
    ←    Response ← ← ←
```

## 📝 Exemple : Gestion des rôles

### Types (`src/types/role.ts`)
```typescript
export interface Role {
  id: string;
  title: string;
  code: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}
```

### Service (`src/services/roleService.ts`)
```typescript
export class RoleService {
  async getUsualRoles(): Promise<Role[]> {
    return apiService.get<Role[]>(`${this.endpoint}/index-usual-role`)
  }
}
```

### Store (`src/stores/role.ts`)
```typescript
export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([])
  
  const fetchRoles = async () => {
    const data = await roleService.getUsualRoles()
    roles.value = data
  }
  
  return { roles, fetchRoles }
})
```

### Composant (`src/components/SignupModal.vue`)
```vue
<script setup lang="ts">
const roleStore = useRoleStore()

onMounted(() => {
  roleStore.fetchRoles()
})
</script>

<template>
  <div v-for="role in roleStore.availableRoles">
    {{ role.title }}
  </div>
</template>
```

## 🎯 Bonnes pratiques

### 1. Séparation des responsabilités
- Les composants ne font pas d'appels API directs
- Les stores ne contiennent pas de logique de présentation
- Les services ne connaissent pas les composants

### 2. Typage strict
- Tous les échanges de données sont typés
- Utilisation d'interfaces pour les contrats
- Validation des structures de données

### 3. Gestion des erreurs
- Centralisée dans les services
- Propagée jusqu'aux composants
- Messages utilisateur clairs

### 4. Performance
- Chargement lazy des routes
- Mise en cache dans les stores
- Computed properties pour les dérivations

## 🚀 Getting Started

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Accéder à l'application**
   - URL de base : http://localhost:5173
   - Page de test : http://localhost:5173/test-signup

## 🧪 Tests

### Page de test des rôles
La page `/test-signup` permet de tester :
- L'affichage dynamique des rôles depuis l'API
- Le fonctionnement du SignupModal
- Les différents états (loading, error, success)

### API Endpoint
- URL : `http://127.0.0.1:8000/api/roles/index-usual-role`
- Méthode : GET
- Retourne la liste des rôles disponibles

## 📈 Évolutions futures

1. **Authentication** : Intégration JWT
2. **Form Validation** : Zod + VueHookForm
3. **Testing** : Vitest + Vue Test Utils
4. **Internationalisation** : Vue I18n
5. **State Persistence** : Pinia Persistence

## 🔍 Débogage

### Outils de développement
- Vue DevTools pour inspecter les composants et stores
- Console pour les logs des services
- Network tab pour les appels API

### Points de vigilance
- Vérifier les types TypeScript
- Surveiller les erreurs API
- Valider les structures de données
