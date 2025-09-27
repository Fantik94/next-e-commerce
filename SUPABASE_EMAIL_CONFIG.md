# Configuration Email Supabase

## 🔧 Configuration dans Supabase Dashboard

### 1. **Authentication Settings**
Aller dans : **Authentication** → **Settings** → **Email**

### 2. **Paramètres Email**

#### ✅ **Enable email confirmations**
- [x] Enable email confirmations
- [x] Enable email change confirmations  
- [x] Enable secure email change

#### 📧 **Email Templates**
Aller dans : **Authentication** → **Email Templates**

##### **Confirm signup template :**
```html
<h2>Confirmez votre inscription à DigitalFADA</h2>

<p>Bonjour,</p>

<p>Merci de vous être inscrit sur <strong>DigitalFADA.shop</strong> !</p>

<p>Pour activer votre compte, cliquez sur le lien ci-dessous :</p>

<p>
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Confirmer mon email
  </a>
</p>

<p>Ou copiez-collez ce lien dans votre navigateur :</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

<p>Ce lien expire dans 24 heures.</p>

<p>Si vous n'avez pas créé de compte, ignorez cet email.</p>

<p>Cordialement,<br>L'équipe DigitalFADA</p>
```

#### 🔗 **Redirect URLs**
Dans **Authentication** → **URL Configuration** :

```
Site URL: http://localhost:3000

Redirect URLs:
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
http://localhost:3000/login
http://localhost:3000/register
```

### 3. **Configuration SMTP (Optionnel)**

Pour utiliser votre propre serveur email au lieu de celui de Supabase :

#### **Settings SMTP :**
- **Enable custom SMTP** : ✅
- **Host** : smtp.gmail.com (ou votre provider)
- **Port** : 587
- **Username** : votre-email@gmail.com
- **Password** : votre-mot-de-passe-app
- **Sender name** : DigitalFADA
- **Sender email** : noreply@digitalfada.shop

### 4. **Test de configuration**

1. **Créer un compte** sur `/register`
2. **Vérifier** que l'email est envoyé
3. **Cliquer** sur le lien dans l'email
4. **Vérifier** la redirection vers `/auth/confirm`

## 🚨 **Important**

- Les emails Supabase gratuits ont une limite quotidienne
- Pour la production, configurez votre propre SMTP
- Testez toujours en local avant de déployer

## 📝 **URLs de confirmation**

Le lien dans l'email aura cette structure :
```
http://localhost:3000/auth/confirm?token=xxx&type=signup
```

Notre page `/auth/confirm` gère automatiquement ces paramètres.
