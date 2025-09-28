# 🔧 Configuration Supabase - URLs de redirection

## 📍 Configuration Dashboard

### Authentication → URL Configuration

#### Site URL:
```
http://localhost:3000
```

#### Redirect URLs (à copier/coller):
```
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000/profile
http://localhost:3000/reset-password
```

## 🌐 Pour Production (plus tard)

### Site URL:
```
https://tondomaine.com
```

### Redirect URLs:
```
https://tondomaine.com
https://tondomaine.com/auth/callback
https://tondomaine.com/auth/confirm
https://tondomaine.com/login
https://tondomaine.com/register
https://tondomaine.com/profile
https://tondomaine.com/reset-password
```

## 🔐 OAuth Providers

### Google Cloud Console
**Authorized redirect URIs:**
```
https://ncpqaqtvcmqohganurtl.supabase.co/auth/v1/callback
```

### Facebook Developer Console
**Valid OAuth Redirect URIs:**
```
https://ncpqaqtvcmqohganurtl.supabase.co/auth/v1/callback
```

## ✅ Vérification

Après configuration, tester:
1. Connexion email/password
2. Inscription avec email
3. Google OAuth (si configuré)
4. Reset password
5. Redirection après login

---

**🎯 Toutes les redirections sont configurées pour un flow d'authentification complet !**
