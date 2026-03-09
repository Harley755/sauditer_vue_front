# 🧪 Guide de Test - Frontend + Backend FastAPI

## 📋 Prérequis

1. **Backend FastAPI démarré** : `http://127.0.0.1:8000`
2. **Frontend Vue.js démarré** : `http://localhost:3000`
3. **CORS configuré** avec `allow_credentials=True`

---

## 🔧 Étapes de Test

### 1. **Vérifier les endpoints API**

```bash
# Test login
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "test@example.com", "password": "password"}'

# Test refresh
curl -X POST http://127.0.0.1:8000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt

# Test debug tokens
curl -X GET http://127.0.0.1:8000/api/auth/debug/tokens \
  -b cookies.txt
```

### 2. **Tester dans le navigateur**

#### Ouvrir les DevTools → Console et lancer :

```javascript
// Test du service d'auth
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 1. Login
try {
  const result = await authStore.login({
    email: 'test@example.com',
    password: 'password'
  })
  console.log('Login réussi:', result)
  console.log('Utilisateur:', authStore.user)
} catch (error) {
  console.error('Login échoué:', error)
}

// 2. Vérifier les cookies
await authStore.debugCookies()

// 3. Test refresh
try {
  const refreshed = await authStore.refreshAuth()
  console.log('Refresh réussi:', refreshed)
} catch (error) {
  console.error('Refresh échoué:', error)
}

// 4. Logout
try {
  await authStore.logout()
  console.log('Logout réussi')
} catch (error) {
  console.error('Logout échoué:', error)
}
```

### 3. **Vérifier les cookies dans DevTools**

1. **Ouvrir DevTools** → **Application** → **Cookies**
2. **Chercher** : `127.0.0.1:8000`
3. **Vérifier** :
   - `access_token` (expire 15min)
   - `refresh_token` (expire 7 jours)

### 4. **Test du route guard**

```javascript
// Test navigation
import { useRouter } from 'vue-router'

const router = useRouter()

// Essayer d'accéder au dashboard sans être connecté
router.push('/dashboard')  // Devrait rediriger vers /

// Se connecter puis essayer
await authStore.login({ email: 'test@example.com', password: 'password' })
router.push('/dashboard')  // Devrait fonctionner
```

---

## 🔍 Points de Vérification

### ✅ **Login**
- [ ] Status 200
- [ ] Cookies créés (access_token + refresh_token)
- [ ] `authStore.user` peuplé
- [ ] `authStore.isAuthenticated` = true

### ✅ **Refresh automatique**
- [ ] Après 15min, navigation vers dashboard fonctionne
- [ ] Nouveau access_token créé
- [ ] `authStore.user` toujours présent

### ✅ **Logout**
- [ ] Cookies supprimés
- [ ] `authStore.user` = null
- [ ] Redirection vers page d'accueil

### ✅ **Route guards**
- [ ] Dashboard inaccessible sans auth
- [ ] Redirection automatique vers /
- [ ] Refresh transparent pour l'utilisateur

---

## 🐛 Dépannage

### **Problème : Cookies non créés**
```bash
# Vérifier CORS
curl -I http://127.0.0.1:8000/api/auth/login
# Doit contenir : Access-Control-Allow-Credentials: true
```

### **Problème : 401 sur refresh**
```javascript
// Vérifier les cookies dans DevTools
console.log(document.cookie)  // Devrait être vide (HttpOnly)
// Utiliser l'endpoint debug
await authStore.debugCookies()
```

### **Problème : CORS**
```python
# Dans FastAPI, vérifier :
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,  # CRUCIAL
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Monitoring

### **Logs FastAPI**
```bash
# Vérifier les logs du backend
# Tu devrais voir :
# ACCESS TOKEN généré: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
# REFRESH TOKEN généré: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
# NOUVEL ACCESS TOKEN généré: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### **Network Tab**
- **Login** : POST /auth/login (200) + Set-Cookie headers
- **Refresh** : POST /auth/refresh (200) + Set-Cookie access_token
- **Logout** : POST /auth/logout (200) + Set-Cookie headers expirés

---

## 🎯 Résultat Attendu

Une fois tout testé, tu devrais avoir :

1. **Login fonctionnel** avec HttpOnly cookies
2. **Refresh automatique** transparent
3. **Route guards sécurisés**
4. **Logout propre** avec suppression des cookies
5. **Protection XSS** (tokens non visibles en JS)

Le système est maintenant **enterprise-grade** ! 🛡️
