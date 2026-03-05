# Soumission des Réponses - API Backend

## 🎯 **Objectif atteint**

Ajout de la soumission des réponses du questionnaire à l'API backend lorsque l'utilisateur clique sur **"Terminer l'audit"**.

## 🔧 **Fonctionnalité implémentée**

### 1️⃣ **Fonction `submitAnswers()`**

```typescript
async function submitAnswers(payload: any) {
  const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:8001'
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/questionnaires/submit-answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log("SUBMIT ANSWERS SUCCESS:", result)
    return result
  } catch (error) {
    console.error('SUBMIT ANSWERS ERROR:', error)
    throw error
  }
}
```

### 2️⃣ **Transformation des réponses**

**Store audit → Payload API**

```typescript
const reponses = auditStore.currentAudit?.answers.map(a => {
  const r: any = {
    question_id: a.questionId,
    valeur: a.answer
  }

  if (a.notes && a.notes.trim() !== "") {
    r.commentaire = a.notes
  }

  return r
}) || []
```

### 3️⃣ **Payload final**

```typescript
const payload = {
  questionnaire_id: questionnaireStore.currentQuestionnaire?.id || '',
  user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  reponses
}
```

## 📊 **Format JSON envoyé**

```json
{
  "questionnaire_id": "78174117-bae8-4640-933b-40e2a362f5ae",
  "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "reponses": [
    {
      "question_id": "uuid-question-1",
      "valeur": "Oui"
    },
    {
      "question_id": "uuid-question-2", 
      "valeur": "Description détaillée du processus",
      "commentaire": "Notes complémentaires"
    }
  ]
}
```

## 🔍 **Debug Console**

**Logs ajoutés :**

```typescript
console.log("LAST QUESTION - SUBMITTING ANSWERS")

console.log("===== PAYLOAD SUBMIT ANSWERS =====")
console.log(JSON.stringify(payload, null, 2))

console.log("ANSWERS SUBMITTED SUCCESSFULLY")
```

## 🚀 **Flux d'exécution**

1. **Utilisateur clique sur "Terminer l'audit"**
2. **Sauvegarde de la dernière réponse**
3. **Transformation des réponses du store**
4. **Construction du payload JSON**
5. **Affichage du payload dans la console**
6. **Appel POST vers `/api/v1/questionnaires/submit-answers`**
7. **Redirection vers `/results`**

## ✅ **Gestion des erreurs**

```typescript
submitAnswers(payload)
  .then(() => {
    console.log("ANSWERS SUBMITTED SUCCESSFULLY")
    auditStore.completeAudit()
    router.push('/results')
  })
  .catch((error) => {
    console.error("FAILED TO SUBMIT ANSWERS:", error)
    // Même en cas d'erreur, on continue vers les résultats
    auditStore.completeAudit()
    router.push('/results')
  })
```

## 🎯 **Points clés**

- ✅ ** questionnaire_id** : vient de `questionnaireStore.currentQuestionnaire.id`
- ✅ ** user_id** : UUID statique pour debug
- ✅ ** reponses** : transformation du store audit
- ✅ ** commentaire** : optionnel, ajouté seulement si `notes` existe
- ✅ ** API URL** : configurable via `VITE_API_BASE_URL`
- ✅ ** Error handling** : continue vers results même en cas d'erreur

**Les réponses du questionnaire sont maintenant soumises à l'API backend !**
