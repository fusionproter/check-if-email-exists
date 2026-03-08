# 📧 Email Validator - SaaS Prêt à Déployer

> Application web moderne de validation d'emails. Déployez en 1 clic depuis Bolt!

[![Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green)]()
[![React](https://img.shields.io/badge/React-19-blue)]()
[![Vite](https://img.shields.io/badge/Vite-7-purple)]()

## ✨ Fonctionnalités

- 🎯 **Validation Unique** - Vérification détaillée d'un email
- 📊 **Validation en Masse** - Jusqu'à 50,000 emails (CSV ou texte)
- ⚡ **Temps Réel** - Progression live avec statistiques
- 📥 **Export CSV** - Téléchargez tous vos résultats
- 🎨 **Interface Moderne** - Design responsive et intuitif
- 🔒 **100% Gratuit** - Hébergement et API inclus

## 🚀 Déploiement (1 clic!)

### Depuis Bolt

1. Cliquez sur **"Deploy"** en haut à droite
2. Sélectionnez **Netlify** ou **Vercel**
3. **C'est tout!** 🎉

### Alternative: Ligne de Commande

```bash
# Frontend
cd frontend
npm install
npm run build
npx netlify-cli deploy --prod --dir=dist

# OU avec Vercel
npx vercel --prod
```

**📖 Guide complet**: [DEPLOIEMENT_BOLT.md](./DEPLOIEMENT_BOLT.md)

## 🎯 Validation Complète

Chaque email est vérifié pour:

| Vérification | Description |
|--------------|-------------|
| ✅ Syntaxe | Format RFC valide |
| ✅ MX Records | Serveurs mail configurés |
| ⚠️ Jetable | Emails temporaires (Mailinator, etc.) |
| ⚠️ Rôle | Comptes génériques (admin@, info@, etc.) |

### Résultats

- **Safe (Deliverable)** - Email valide et livrable ✅
- **Risky** - Email existe mais suspect ⚠️
- **Invalid** - Email n'existe pas ❌
- **Unknown** - Impossible à vérifier ❓

## 💻 Architecture

```
React Frontend (Vite)
       ↓
Supabase Edge Functions (Deno)
       ↓
Supabase Database (PostgreSQL)
```

**Tout est hébergé sur Supabase = Aucun serveur à gérer!**

## 🧪 Tester Localement

```bash
cd frontend
npm install
npm run dev
```

Ouvrez http://localhost:5173

## 📁 Structure

```
.
├── frontend/              # Application React
│   ├── src/
│   │   ├── components/   # Composants UI
│   │   ├── App.jsx       # Application principale
│   │   └── App.css       # Styles
│   └── dist/             # Build de production
├── supabase/
│   └── functions/        # Edge Functions (Backend)
│       ├── validate-email/
│       ├── bulk-validate/
│       ├── bulk-status/
│       └── bulk-results/
└── DEPLOIEMENT_BOLT.md   # 👈 Guide de déploiement
```

## 🎨 Captures d'Écran

### Validation Unique
- Syntaxe, MX records, détection jetable/rôle
- Résultats détaillés instantanés

### Validation en Masse
- Upload CSV ou saisie directe
- Progress bar temps réel
- Stats: Deliverable/Risky/Invalid
- Export complet en CSV

## 🔧 Personnalisation

### Design
Modifiez `frontend/src/App.css` pour changer les couleurs, polices, etc.

### Logique de Validation
Éditez les Edge Functions dans `supabase/functions/`

### Ajouter des Domaines Jetables
Mettez à jour `disposableDomains` dans `validate-email/index.ts`

## 💰 Coûts

**100% GRATUIT** avec Supabase:
- Edge Functions: 500,000 invocations/mois
- Database: 500 MB
- Bandwidth: 5 GB/mois

Largement suffisant pour:
- Projets personnels
- Petites entreprises
- Démos et portfolios

## 📊 Endpoints API

Tous les endpoints sont déjà déployés:

```javascript
// Validation unique
POST https://votre-projet.supabase.co/functions/v1/validate-email
Body: { "to_email": "test@example.com" }

// Validation bulk
POST https://votre-projet.supabase.co/functions/v1/bulk-validate
Body: { "input": ["email1@...", "email2@..."] }

// Statut
GET https://votre-projet.supabase.co/functions/v1/bulk-status?job_id=XXX

// Résultats
GET https://votre-projet.supabase.co/functions/v1/bulk-results?job_id=XXX&format=csv
```

## 🔐 Sécurité

- ✅ HTTPS automatique
- ✅ Row Level Security (RLS) activé
- ✅ Pas de stockage permanent des emails (optionnel)
- ✅ Rate limiting via Supabase

## 🤝 Contribution

1. Fork le projet
2. Créez une branche: `git checkout -b feature/ma-feature`
3. Commit: `git commit -m 'Ajout feature'`
4. Push: `git push origin feature/ma-feature`
5. Pull Request

## 📄 License

MIT License - Voir LICENSE.md

## 🆘 Support

- **Documentation**: [DEPLOIEMENT_BOLT.md](./DEPLOIEMENT_BOLT.md)
- **Issues**: Créez une issue GitHub
- **Questions**: Discussions GitHub

---

<div align="center">

**Prêt en 1 clic! Cliquez sur "Deploy" et c'est parti! 🚀**

Fait avec ❤️ et Supabase

[Déployer Maintenant](./DEPLOIEMENT_BOLT.md) | [Documentation Complète](./DEPLOIEMENT_BOLT.md)

</div>
