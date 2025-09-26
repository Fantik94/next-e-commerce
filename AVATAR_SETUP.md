# 📸 Configuration Upload d'Avatar - Guide

## 🗃️ Configuration Supabase nécessaire

### 1. Exécuter le nouveau schema SQL
```sql
-- Dans Supabase Dashboard > SQL Editor
-- Copier/coller le contenu de supabase/schema.sql
-- Exécuter pour créer le bucket avatars et les politiques RLS
```

### 2. Vérifier le Storage
1. **Supabase Dashboard** → **Storage**
2. Vérifier que le bucket `avatars` est créé
3. **Policies** → Vérifier les 4 politiques RLS

## 🎯 Fonctionnalités implémentées

### ✅ Hook useAvatarUpload
- **Upload** avec validation et redimensionnement
- **Suppression** automatique des anciens avatars
- **Validation** : types MIME, taille (5MB max)
- **Redimensionnement** automatique (400px max)
- **Gestion d'erreurs** complète

### ✅ Composant AvatarUpload
- **3 tailles** : sm (64px), md (96px), lg (128px)
- **Drag & Drop** support
- **Preview** en temps réel
- **Loading states** avec spinner
- **Boutons** upload/suppression

### ✅ Intégration ProfileHeader
- Avatar cliquable dans l'en-tête
- Remplacement automatique de l'ancien système

### ✅ Page dédiée
- `/profile/avatar` - Page complète d'upload
- Conseils et instructions
- Interface utilisateur intuitive

## 🧪 Comment tester

### 1. Prérequis
```bash
# S'assurer que le schema SQL est exécuté
npm run dev
```

### 2. Test de l'upload
1. **Se connecter** à l'application
2. **Aller** sur `/profile` 
3. **Cliquer** sur l'avatar ou l'icône caméra
4. **Choisir** une image (JPG, PNG, WebP, GIF < 5MB)
5. **Vérifier** l'upload et la mise à jour

### 3. Test du drag & drop
1. **Prendre** une image depuis l'ordinateur
2. **Glisser** sur l'avatar
3. **Voir** le feedback visuel
4. **Relâcher** pour uploader

### 4. Test de suppression
1. **Cliquer** "Supprimer" si avatar existant
2. **Confirmer** la suppression
3. **Vérifier** retour au placeholder

### 5. Test des validations
- **Fichier trop gros** (> 5MB) → erreur
- **Format non supporté** (PDF, etc.) → erreur
- **Upload sans connexion** → erreur

## 🔧 Fichiers créés/modifiés

### Nouveaux fichiers
- `src/hooks/useAvatarUpload.tsx` - Hook d'upload
- `src/components/profile/avatar-upload.tsx` - Composant principal
- `src/app/profile/avatar/page.tsx` - Page dédiée

### Fichiers modifiés
- `supabase/schema.sql` - Config Storage
- `src/components/profile/profile-header.tsx` - Intégration
- `src/hooks/useAuth.tsx` - Types UserProfile (avatar)

## 🎨 Utilisation dans le code

### Composant simple
```tsx
import AvatarUpload from '@/components/profile/avatar-upload';

<AvatarUpload size="md" showUploadText={true} />
```

### Hook direct
```tsx
import { useAvatarUpload } from '@/hooks/useAvatarUpload';

const { uploading, uploadAvatar, deleteAvatar } = useAvatarUpload();
```

## 🔐 Sécurité

### Politiques RLS configurées
- **Lecture publique** des avatars
- **Upload** seulement dans son dossier
- **Modification/Suppression** seulement ses fichiers
- **Validation** côté client ET serveur

### Structure des fichiers
```
avatars/
  ├── {user_id}/
  │   ├── {timestamp}.jpg
  │   ├── {timestamp}.png
  │   └── ...
```

## ⚡ Optimisations

- **Redimensionnement** automatique (400px max)
- **Compression** avec qualité 0.8
- **Suppression** automatique des anciens
- **Cache** 1h sur les URLs publiques
- **Loading states** pour UX fluide

---

**🎉 Système d'upload d'avatar complet et sécurisé ! 📸**
