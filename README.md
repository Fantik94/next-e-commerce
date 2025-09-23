# 🛒 Next E-Commerce - Projet d'apprentissage

Un site e-commerce moderne et performant créé avec Next.js, TypeScript, Tailwind CSS et shadcn/ui.

## 🚀 Technologies utilisées

- **Next.js 14** (App Router) - Framework React full-stack
- **TypeScript** - Typage statique pour éviter les bugs
- **Tailwind CSS** - Framework CSS utilitaire moderne
- **shadcn/ui** - Composants UI élégants et accessibles
- **React** - Bibliothèque d'interface utilisateur

## 📦 Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Lancer en production
npm start
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🗺️ Roadmap du projet

### Phase 1: Fondations ✅
- [x] Initialisation du projet Next.js
- [x] Configuration de Tailwind CSS
- [x] Installation de shadcn/ui
- [x] Structure de dossiers organisée
- [x] Layout de base (Header/Footer)

### Phase 2: Interface utilisateur ✅
- [x] Page d'accueil attractive
- [x] Navigation responsive
- [x] Catalogue de produits avec grille
- [x] Page détail produit
- [x] Système de recherche et filtres
- [x] Panier d'achat (sidebar)
- [x] Design mobile-first

### Phase 3: Gestion des données 📊
- [ ] API Routes Next.js
- [ ] Modèles de données (produits, utilisateurs, commandes)
- [ ] Base de données (prisma + sqlite en dev)
- [ ] Gestion d'état global (context ou zustand)
- [ ] Cache et optimisations

### Phase 4: Authentification 🔐
- [ ] Système d'inscription/connexion
- [ ] Profil utilisateur
- [ ] Gestion des sessions
- [ ] Protection des routes

### Phase 5: E-commerce avancé 💳
- [ ] Processus de commande complet
- [ ] Intégration paiement (Stripe)
- [ ] Gestion des stocks
- [ ] Historique des commandes
- [ ] Système de favoris

### Phase 6: Administration 👨‍💼
- [ ] Panel d'administration
- [ ] CRUD produits
- [ ] Gestion des commandes
- [ ] Statistiques et analytics
- [ ] Upload d'images

### Phase 7: Optimisations & Déploiement 🚀
- [ ] SEO optimisé
- [ ] Performance (images, lazy loading)
- [ ] Tests unitaires
- [ ] Déploiement (Vercel)
- [ ] Domain personnalisé

## 📁 Structure du projet

```
src/
├── app/                    # App Router Next.js
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── ui/               # Composants shadcn/ui
│   ├── layout/           # Header, Footer, Navigation
│   ├── product/          # Composants liés aux produits
│   └── cart/             # Composants du panier
├── lib/                  # Utilitaires et configuration
├── types/                # Types TypeScript
└── hooks/                # Hooks personnalisés
```

## 🎯 Fonctionnalités prévues

### 🛍️ **Catalogue produits**
- Grille responsive de produits
- Filtres par catégorie, prix, marque
- Recherche en temps réel
- Tri (prix, popularité, nouveautés)
- Pagination infinie

### 🛒 **Panier d'achat**
- Ajout/suppression en temps réel
- Calcul automatique du total
- Sauvegarde locale
- Animation fluides

### 👤 **Gestion utilisateur**
- Inscription/connexion sécurisée
- Profil utilisateur
- Historique des commandes
- Liste de favoris

### 💰 **Système de paiement**
- Intégration Stripe
- Paiement sécurisé
- Confirmation par email
- Suivi de commande

### 📱 **Responsive design**
- Mobile-first
- Navigation tactile optimisée
- Performance sur tous les appareils

## 🎨 Design System

- **Couleurs**: Palette moderne et épurée
- **Typography**: Inter (Google Fonts)
- **Composants**: shadcn/ui pour la cohérence
- **Icônes**: Lucide React
- **Animations**: Framer Motion (optionnel)

## 📚 Ressources d'apprentissage

- [Documentation Next.js](https://nextjs.org/docs)
- [Guide Tailwind CSS](https://tailwindcss.com/docs)
- [Composants shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

🎓 **Projet d'apprentissage** - Chaque étape sera expliquée et documentée pour comprendre les concepts Next.js et les bonnes pratiques du développement web moderne.