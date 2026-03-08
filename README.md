# 📧 Email Validator - SaaS en Ligne

> **Validez des milliers d'emails en quelques clics. Interface moderne, API puissante, déploiement gratuit.**

[![Deploy](https://img.shields.io/badge/deploy-ready-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Rust](https://img.shields.io/badge/rust-stable-orange)]()
[![React](https://img.shields.io/badge/react-19-blue)]()

![Email Validator](https://via.placeholder.com/800x400/667eea/ffffff?text=Email+Validator+SaaS)

## ✨ Fonctionnalités

- 🎯 **Validation Unique** - Vérification détaillée d'un seul email
- 📊 **Validation en Masse** - Jusqu'à 50,000 emails via CSV ou texte
- ⚡ **Temps Réel** - Suivi de progression live avec statistiques
- 📥 **Export CSV** - Téléchargez tous vos résultats
- 🎨 **Interface Moderne** - Design responsive et intuitif
- 🔐 **Vérification Complète** - Syntaxe, MX, SMTP, disposable, role accounts
- 🌍 **Déployable en 10 min** - Sur Vercel + Fly.io gratuitement

## 🚀 Démarrage Rapide

### Option 1: Déployer en Ligne (10 minutes)

```bash
# 1. Installer Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Déployer le backend
cd backend
flyctl launch && flyctl deploy

# 3. Déployer le frontend sur Vercel
# Importez le repo sur vercel.com
# Ajoutez VITE_API_URL avec l'URL Fly.io
```

**📖 Guide complet**: [START_HERE.md](./START_HERE.md)

### Option 2: Développement Local

```bash
# Terminal 1 - Backend
cd backend && cargo run

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

Ouvrez http://localhost:5173

## 📸 Captures d'Écran

### Validation Unique
Validation détaillée avec informations complètes:
- ✅ Syntaxe valide
- ✅ Serveurs MX configurés
- ✅ Boîte mail accessible
- ⚠️ Détection catch-all, disposable, role accounts

### Validation en Masse
- 📂 Upload CSV ou texte
- 📊 Progress bar temps réel
- 📈 Statistiques: Deliverable / Risky / Invalid / Unknown
- 💾 Export complet en CSV

## 🏗️ Architecture

```
┌─────────────┐      HTTPS      ┌──────────────┐
│   Vercel    │ ←------------→  │   Fly.io     │
│  (Frontend) │                 │  (Backend)   │
│  React App  │                 │   Rust API   │
└─────────────┘                 └──────────────┘
```

**Stack Technique**:
- **Backend**: Rust, Warp, check-if-email-exists
- **Frontend**: React 19, Vite 7
- **Database**: Supabase (optionnel)
- **Hosting**: Vercel (frontend) + Fly.io (backend)
- **Coût**: Gratuit!

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| **[START_HERE.md](./START_HERE.md)** | 👈 **Commencez ici!** |
| [DEPLOY_RAPIDE.md](./DEPLOY_RAPIDE.md) | Déploiement en 10 minutes |
| [DEPLOY_ONLINE.md](./DEPLOY_ONLINE.md) | Guide de déploiement complet |
| [DEMARRAGE.md](./DEMARRAGE.md) | Guide avec checklist |
| [LIENS_UTILES.md](./LIENS_UTILES.md) | Commandes et ressources |
| [README_SAAS.md](./README_SAAS.md) | Documentation technique |

## 🎯 API Endpoints

### Validation Unique
```bash
POST /v1/check_email
{
  "to_email": "test@example.com"
}
```

### Validation Bulk
```bash
# Créer un job
POST /v1/bulk
{
  "input": ["email1@example.com", "email2@example.com"]
}

# Vérifier la progression
GET /v1/bulk/{job_id}

# Télécharger les résultats
GET /v1/bulk/{job_id}/results?format=csv
```

## 🔍 Validation Détaillée

Chaque email est vérifié pour:

| Vérification | Description |
|--------------|-------------|
| ✅ **Syntaxe** | Format RFC-compliant |
| ✅ **MX Records** | Serveurs mail configurés |
| ✅ **SMTP** | Connexion au serveur et vérification de la boîte |
| ⚠️ **Catch-all** | Domaine accepte tous les emails |
| ⚠️ **Disposable** | Service d'email temporaire |
| ⚠️ **Role Account** | Adresse générique (admin@, info@, etc.) |

### Résultats

- **Deliverable** - Email valide et livrable ✅
- **Risky** - Email existe mais propriétés suspectes ⚠️
- **Undeliverable** - Email n'existe pas ❌
- **Unknown** - Vérification impossible ❓

## 💰 Coûts

### Plan Gratuit

- **Fly.io**: 3 apps, 160GB/mois
- **Vercel**: Bande passante illimitée
- **GitHub**: Repos illimités

**Suffisant pour**: Projets persos, petites entreprises, portfolios

### Scaling

Si vous dépassez les limites gratuites:
- **Fly.io**: ~$5-10/mois
- **Vercel**: Pro si nécessaire (rare)

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev:frontend    # Démarre le frontend
npm run dev:backend     # Démarre le backend

# Build
npm run build:frontend  # Build le frontend
npm run build:backend   # Build le backend

# Déploiement
npm run deploy:frontend # Déploie sur Vercel
npm run deploy:backend  # Déploie sur Fly.io
npm run deploy          # Déploie tout

# Debug
flyctl logs            # Logs backend
flyctl status          # Status backend
```

## 🌟 Fonctionnalités Avancées

### Domaine Personnalisé

**Vercel**: Settings → Domains → Ajoutez `votredomaine.com`  
**Fly.io**: `flyctl certs add votredomaine.com`

### Rate Limiting

Configure dans `backend/backend_config.toml`:
```toml
[throttle]
max_requests_per_minute = 100
max_requests_per_day = 10000
```

### Base de Données

Active PostgreSQL pour stocker l'historique:
```bash
flyctl postgres create
flyctl postgres attach
```

## 🤝 Contribution

Les contributions sont les bienvenues!

1. Fork le projet
2. Créez une branche: `git checkout -b feature/ma-feature`
3. Commit: `git commit -m 'Ajout feature'`
4. Push: `git push origin feature/ma-feature`
5. Ouvrez une Pull Request

## 📄 License

MIT License - Voir [LICENSE.md](LICENSE.md)

## 🆘 Support

- 📖 **Documentation**: Voir les guides ci-dessus
- 🐛 **Bug**: Ouvrez une issue
- 💬 **Questions**: Discussions GitHub
- 📧 **Email**: support@votredomaine.com

## 🎓 Ressources

- [Documentation Fly.io](https://fly.io/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Rust Book](https://doc.rust-lang.org/book/)
- [React Docs](https://react.dev)

## ⭐ Star le Projet

Si ce projet vous aide, donnez-lui une étoile! ⭐

---

<div align="center">

**[Commencer Maintenant](./START_HERE.md)** | 
**[Documentation](./README_SAAS.md)** | 
**[Déployer](./DEPLOY_RAPIDE.md)**

Fait avec ❤️ et Rust 🦀

</div>
