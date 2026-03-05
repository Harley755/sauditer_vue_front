# Validation Backend FastAPI - Formulaire d'Audit

## 🎯 Objectif

Corriger le popup "Personnaliser l'audit" pour respecter strictement les contraintes de validation du backend FastAPI et éviter les erreurs 422.

## 📁 Fichiers créés

### Constants
- `src/constants/organizationSize.ts` - Mapping des tailles d'organisation
- `src/constants/maturityLevels.ts` - Mapping des niveaux de maturité  
- `src/constants/referentialMapping.ts` - Mapping des référentiels API

### Modifications
- `src/pages/AuditSelection.vue` - Formulaire avec validation stricte

## 🔧 Contraintes Backend

### Référentiels autorisés (lowercase)
```typescript
{
  "ISO 27001": "iso27001",
  "NIST CSF": "nist_csf", 
  "RGPD": "rgpd",
  "SOC 2": "soc2"
}
```

### Tailles autorisées (casse exacte)
```typescript
[
  { label: "Très petite entreprise (TPE)", value: "TPE" },
  { label: "Petite et moyenne entreprise (PME)", value: "PME" },
  { label: "Entreprise de taille intermédiaire (ETI)", value: "ETI" },
  { label: "Grande entreprise", value: "Grande entreprise" },
  { label: "Startup", value: "Startup" }
]
```

### Niveaux de maturité (lowercase)
```typescript
[
  { label: "Initial — sécurité ad hoc", value: "initial" },
  { label: "Repeatable — pratiques basiques", value: "repeatable" },
  { label: "Défini — processus documentés", value: "défini" },
  { label: "Géré — pilotage et métriques", value: "géré" },
  { label: "Optimisé — amélioration continue", value: "optimisé" }
]
```

## 🚀 Payload Final

Le formulaire envoie maintenant exactement :

```typescript
{
  referentiel: "iso27001",     // lowercase
  secteur: "Finance",           // texte libre
  taille: "PME",              // casse exacte
  niveau_estime: "initial"      // lowercase
}
```

## ✅ Validations implémentées

### Frontend
- Validation du secteur (non vide)
- Validation de la taille (valeur autorisée)
- Validation du niveau (valeur autorisée)
- Validation du référentiel (supporté backend)

### Backend
- Mapping automatique des valeurs
- Erreurs 422 évitées
- Messages d'erreur clairs

## 🎨 Améliorations UX

- Secteur : champ texte avec placeholder descriptif
- Taille : dropdown avec labels compréhensibles
- Niveau : dropdown avec descriptions détaillées
- Messages d'erreur contextuels
- Bouton désactivé si formulaire invalide

## 🔒 Sécurité

- Validation stricte des entrées
- Mapping unidirectionnel (frontend → backend)
- Erreurs gérées avec fallback
- Pas de valeurs hardcodées dans le template

Le formulaire respecte maintenant 100% les contraintes du backend FastAPI.
