# 🔧 Endpoint /me à ajouter à ton FastAPI

Ajoute cet endpoint dans ton `app/routers/auth.py` pour que le frontend puisse récupérer les infos utilisateur après rechargement :

```python
@router.get("/me")
def get_current_user(db: Session = Depends(get_db)):
    """Récupérer l'utilisateur connecté depuis les cookies"""
    try:
        # Récupérer le refresh token depuis les cookies
        from fastapi import Cookie
        
        # Pour l'instant, on utilise le refresh token pour identifier l'utilisateur
        # Dans une version améliorée, tu pourrais utiliser l'access token
        
        # Solution simple : créer une dépendance pour extraire et vérifier le token
        from app.core.security import decodeToken
        
        # Note: Cette approche nécessite d'ajouter le token en paramètre
        # Une meilleure approche serait de créer un système de dépendance FastAPI
        
        # Pour l'instant, solution rapide :
        from fastapi import Request
        
        # Tu devras modifier la signature pour :
        # def get_current_user(request: Request, db: Session = Depends(get_db)):
        
        # Et extraire le token manuellement :
        # access_token = request.cookies.get("access_token")
        # if not access_token:
        #     raise HTTPException(status_code=401, detail="Non authentifié")
        
        # token_data = decodeToken(access_token)
        # if not token_data:
        #     raise HTTPException(status_code=401, detail="Token invalide")
        
        # user = getUserWithRoles(db, token_data.sub)
        # if not user:
        #     raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
        
        # return {"data": UserResponse.model_validate(user).model_dump(mode="json")}
        
        # Pour l'instant, retourne une erreur 501 (Not Implemented)
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            message="Endpoint /me nécessite d'être implémenté. Voir les commentaires dans le code."
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Non authentifié"
        )
```

## 🎯 Solution rapide (temporaire)

Pendant que tu implémentes `/me`, tu peux utiliser cette solution temporaire dans le store :

```typescript
// Dans stores/auth.ts, remplace initAuth() par :
const initAuth = async () => {
  try {
    // Solution temporaire : on considère qu'on est authentifié si refresh fonctionne
    await authService.refreshToken()
    // MAIS on ne peut pas récupérer les infos utilisateur sans /me
    // Donc on garde user.value = null et on utilise isAuthenticated basé sur autre chose
    
    // Alternative : stocker les infos minimales en localStorage (non sécurisé mais temporaire)
    const savedUser = localStorage.getItem('user_cache')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
    
    return true
  } catch (err) {
    user.value = null
    localStorage.removeItem('user_cache')
    return false
  }
}

// Et modifie login() pour :
const login = async (credentials: LoginData) => {
  // ... code existant ...
  
  if (response.data) {
    user.value = response.data
    // Cache temporaire (non sécurisé)
    localStorage.setItem('user_cache', JSON.stringify(response.data))
  }
  
  // ...
}

// Et logout() pour :
const logout = async () => {
  // ... code existant ...
  localStorage.removeItem('user_cache')
  // ...
}
```

## 🔄 Solution complète recommandée

Implémente l'endpoint `/me` correctement :

```python
from fastapi import Request, HTTPException, status
from app.core.security import decodeToken

@router.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Récupérer l'utilisateur connecté depuis les cookies"""
    try:
        # Extraire l'access token des cookies
        access_token = request.cookies.get("access_token")
        
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Non authentifié - token manquant"
            )
        
        # Décoder le token
        token_data = decodeToken(access_token)
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
        
        # Récupérer l'utilisateur
        user = getUserWithRoles(db, token_data.sub)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Utilisateur non trouvé"
            )
        
        return {
            "data": UserResponse.model_validate(user).model_dump(mode="json")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur dans /me: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié"
        )
```

Une fois `/me` implémenté, ton problème de rechargement sera résolu ! 🎯
