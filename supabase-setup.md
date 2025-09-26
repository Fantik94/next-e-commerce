# 🚀 Configuration Supabase - DigitalFADA.shop

## 📋 Étapes de configuration

### 1. ✅ Packages installés
- @supabase/supabase-js
- @supabase/auth-ui-react  
- @supabase/auth-ui-shared

### 2. 🌐 Créer le projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte / Se connecter
3. Nouveau projet : `digitalfada-shop`
4. Région : Europe (EU West, London)
5. Plan : Free

### 3. 🔑 Variables d'environnement à configurer

Créer le fichier `.env.local` avec :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Remplacer par tes vraies valeurs depuis Supabase Dashboard > Settings > API
```

### 4. 📊 Tables à créer (plus tard)
- users (profils utilisateurs)
- products (produits)
- orders (commandes)
- categories (catégories)

### 5. 🔐 Configuration dans le Dashboard Supabase

#### A. Aller dans ton Dashboard Supabase :
1. **🗃️ SQL Editor** → Copier/coller le contenu de `supabase/schema.sql`
2. **▶️ Exécuter** le script pour créer les tables

#### B. Configuration de l'authentification :
1. **🔐 Authentication** → **Settings**
2. **✅ Activer** : Email confirmations
3. **🔗 Site URL** : `http://localhost:3000`
4. **🔄 Redirect URLs** : 
   - `http://localhost:3000`
   - `http://localhost:3000/auth/callback`

#### C. Configuration Google OAuth :
1. **🔐 Authentication** → **Providers**
2. **Google** → **Enable**
3. **Client ID** et **Client Secret** : À obtenir depuis Google Cloud Console
4. **Redirect URL** : `https://ncpqaqtvcmqohganurtl.supabase.co/auth/v1/callback`

##### 📋 Étapes pour Google Cloud Console :
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner existant
3. **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth 2.0 Client ID**
5. **Application type** : Web application
6. **Authorized redirect URIs** : 
   - `https://ncpqaqtvcmqohganurtl.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (pour développement)
7. Copier **Client ID** et **Client Secret** dans Supabase

#### D. Vérifier les politiques RLS :
1. **🗃️ Database** → **Tables**
2. Vérifier que RLS est activé sur toutes les tables

### 6. 🧪 Test de la configuration
```bash
npm run dev
# Vérifier dans la console les logs de connexion Supabase
```

---

**⚠️ Important :** 
- Ne jamais commit le fichier `.env.local`
- Garder le mot de passe de la base de données en sécurité
- Utiliser uniquement la clé `anon` côté client
- Exécuter le schema SQL dans le Dashboard avant de tester
