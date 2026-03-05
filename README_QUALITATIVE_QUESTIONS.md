# Questions Qualitatives - Amélioration UX

## 🎯 **Objectif atteint**

Gestion correcte des **questions qualitatives (sans options)** dans `Questionnaire.vue` en suivant les meilleures pratiques des plateformes GRC.

## 🔧 **Modifications apportées**

### 1️⃣ **Détection des questions qualitatives**

```typescript
const isQualitative = computed(() => {
  return !currentQuestion.value?.options || currentQuestion.value.options.length === 0
})
```

### 2️⃣ **Variable pour réponses texte**

```typescript
const textAnswer = ref('') // Ajouté pour les questions qualitatives
```

### 3️⃣ **Template adaptatif**

**Questions avec options :**
```vue
<div v-if="!isQualitative && currentQuestion?.options?.length">
  <!-- Boutons de réponse dynamiques -->
</div>
```

**Questions qualitatives :**
```vue
<div v-else-if="isQualitative" class="space-y-4">
  <textarea
    v-model="textAnswer"
    placeholder="Décrivez en détail votre approche, vos méthodes, vos outils..."
    rows="4"
  />
  <button @click="handleIDontKnow">Je ne sais pas</button>
</div>
```

### 4️⃣ **Validation unifiée**

```typescript
const isAnswerValid = (): boolean => {
  if (isQualitative.value) {
    return textAnswer.value.trim().length > 0
  }
  return selectedValue.value !== null
}
```

### 5️⃣ **Sauvegarde adaptative**

```typescript
const getAnswerValue = (): string => {
  if (isQualitative.value) {
    return textAnswer.value
  }
  return selectedValue.value || ''
}
```

### 6️⃣ **Chargement des réponses existantes**

```typescript
if (isQualitative.value) {
  textAnswer.value = existingAnswer.answer
} else {
  selectedValue.value = existingAnswer.answer
}
```

## 🎨 **UX finale**

### **Question avec options**
```
[ Oui ] [ Non ] [ Partiel ] [ N/A ]
```

### **Question qualitative**
```
Veuillez décrire votre processus ou votre pratique actuelle

[ textarea obligatoire ]

[ Je ne sais pas ]

Ajouter des notes (optionnel)
```

## 🚀 **Comportement**

### **Bouton "Je ne sais pas"**
```typescript
const handleIDontKnow = () => {
  textAnswer.value = 'Je ne sais pas'
}
```

### **Validation**
- **Options** : `selectedValue !== null`
- **Qualitative** : `textAnswer.trim().length > 0`

### **Sauvegarde**
- **Options** : `selectedValue.value`
- **Qualitative** : `textAnswer.value`

## 📊 **Flux complet**

```
Backend → options: [] → isQualitative: true
           ↓
          textarea obligatoire
           ↓
          validation texte
           ↓
          sauvegarde string
```

## ✅ **Résultat**

- ✅ Plus d'utilisateur bloqué
- ✅ Textarea obligatoire pour les qualitatives
- ✅ Bouton "Je ne sais pas" disponible
- ✅ Validation adaptative
- ✅ Sauvegarde correcte
- ✅ Notes optionnelles préservées

**L'interface suit maintenant les standards des plateformes GRC comme Drata, Vanta et Secureframe !**
