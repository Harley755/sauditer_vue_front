# Debugging Flux API - Questionnaire Generation

## 🔍 Logs ajoutés pour tracer le flux

### 1️⃣ AuditSelection.vue
```typescript
// Clic sur un référentiel
console.log("CLICK REFERENTIAL", referential.nom)

// Clic sur générer questionnaire
console.log("GENERATE QUESTIONNAIRE CLICKED")
console.log("FORM VALIDATION FAILED/PASSED")
console.log("PAYLOAD TO SEND:", payload)
console.log("QUESTIONNAIRE GENERATED SUCCESSFULLY")
```

### 2️⃣ questionnaireStore.ts
```typescript
// Appel de la méthode du store
console.log("STORE GENERATE QUESTIONNAIRE", request)
console.log("STORE QUESTIONNAIRE SET:", currentQuestionnaire.value)
```

### 3️⃣ questionnaireService.ts
```typescript
// Appel du service
console.log("SERVICE GENERATE QUESTIONNAIRE", request)
console.log("SERVICE ERROR:", response.error)
console.log("QUESTIONNAIIIRES : ", response)
```

### 4️⃣ questionnaireAPI.ts
```typescript
// Appel HTTP
console.log("API CALL", endpoint, options)
console.log("API RESPONSE STATUS:", response.status)
console.log("DDATA QUESTIONNAIRE :", data)
console.log("API CALL generateQuestionnaire", endpoint)
```

## 🚀 Flux attendu

Quand l'utilisateur clique sur "Générer le questionnaire" :

1. **AuditSelection.vue** : `GENERATE QUESTIONNAIRE CLICKED`
2. **AuditSelection.vue** : `FORM VALIDATION PASSED` 
3. **AuditSelection.vue** : `PAYLOAD TO SEND: {...}`
4. **questionnaireStore.ts** : `STORE GENERATE QUESTIONNAIRE {...}`
5. **questionnaireService.ts** : `SERVICE GENERATE QUESTIONNAIRE {...}`
6. **questionnaireAPI.ts** : `API CALL generateQuestionnaire /api/v1/questionnaires/generate-questionnaire`
7. **questionnaireAPI.ts** : `API RESPONSE STATUS: 200`
8. **questionnaireAPI.ts** : `DDATA QUESTIONNAIRE : {...}`
9. **questionnaireService.ts** : `QUESTIONNAIIIRES : {...}`
10. **questionnaireStore.ts** : `STORE QUESTIONNAIRE SET: {...}`
11. **AuditSelection.vue** : `QUESTIONNAIRE GENERATED SUCCESSFULLY`

## 🔧 Étapes de debugging

1. Ouvrir la console du navigateur
2. Aller sur `/dashboard`
3. Cliquer sur "Nouvel audit"
4. Sélectionner un référentiel (ex: ISO 27001)
5. Remplir le formulaire :
   - Secteur: "Finance"
   - Taille: "PME" 
   - Niveau: "initial"
6. Cliquer sur "Générer le questionnaire"
7. Observer les logs dans la console

## 🐛 Problèmes possibles

### Si aucun log n'apparaît :
- Le clic n'est pas capté
- Le formulaire ne se soumet pas
- La validation bloque tout

### Si seulement les premiers logs apparaissent :
- La validation échoue
- Le payload est mal formé

### Si les logs apparaissent mais pas l'appel API :
- Le store n'appelle pas le service
- Le service n'appelle pas l'API

### Si l'appel API apparaît mais échoue :
- URL incorrecte
- Backend non démarré
- CORS
- Payload invalide (422)

## 🎯 Actions correctives

Selon les logs observés :

**Logs 1-3 OK mais pas 4** : Problème dans AuditSelection.vue
**Logs 1-4 OK mais pas 5** : Problème dans le store
**Logs 1-5 OK mais pas 6** : Problème dans le service
**Logs 1-6 OK mais erreur 7** : Problème réseau/backend

Le flux est maintenant entièrement tracé pour identifier le point de blocage.
