# 📧 Email Validator - Application SaaS

Application web complète pour valider des adresses email en masse ou individuellement.

![Status](https://img.shields.io/badge/status-ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Fonctionnalités

- ✅ **Validation Unique**: Vérification détaillée d'un seul email
- ✅ **Validation en Masse**: Upload CSV ou saisie directe, jusqu'à 50,000 emails
- ✅ **Résultats Détaillés**: Syntaxe, MX records, SMTP, disposable, role account
- ✅ **Export CSV**: Téléchargez vos résultats
- ✅ **Interface Moderne**: Design responsive et intuitive
- ✅ **Suivi en Temps Réel**: Progress bar et statistiques live
- ✅ **Pas de Connexion**: Utilisez directement sans compte

## 🚀 Déploiement en Ligne (10 minutes)

### Option Rapide
Suivez le guide **[DEPLOY_RAPIDE.md](./DEPLOY_RAPIDE.md)** pour déployer en 10 minutes.

### Option Complète
Consultez **[DEPLOY_ONLINE.md](./DEPLOY_ONLINE.md)** pour toutes les options de déploiement.

### Résumé Ultra-Rapide

```bash
# 1. Backend sur Fly.io
cd backend
flyctl launch
flyctl deploy

# 2. Frontend sur Vercel
# Poussez sur GitHub puis importez sur vercel.com
# Ajoutez VITE_API_URL avec l'URL du backend
```

**C'est tout! Votre SaaS est en ligne! 🎉**

## 💻 Développement Local

```bash
# Terminal 1 - Backend
cd backend
cargo run

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

Ouvrez http://localhost:5173

## 📁 Structure du Projet

```
.
├── backend/              # API Rust (Reacher)
│   ├── src/             # Code source
│   ├── Dockerfile       # Pour déploiement
│   └── fly.toml         # Config Fly.io
├── frontend/            # Interface React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   └── App.jsx      # App principale
│   └── vercel.json      # Config Vercel
├── DEPLOY_RAPIDE.md     # Guide déploiement rapide
└── DEPLOY_ONLINE.md     # Guide déploiement complet
```

## 🌐 Stack Technique

- **Backend**: Rust, Warp, check-if-email-exists
- **Frontend**: React, Vite
- **Database**: Supabase (optionnel)
- **Hosting**: Fly.io + Vercel (gratuit)

## 📊 Validation

L'application vérifie:

1. **Syntaxe**: Format RFC-compliant
2. **MX Records**: Serveurs mail configurés
3. **SMTP**: Boîte mail existe et accepte le courrier
4. **Catch-all**: Domaine accepte tous les emails
5. **Disposable**: Service d'email temporaire
6. **Role Account**: Adresse générique (admin@, info@)

### Résultats

- **Deliverable (Safe)**: Email valide et livrable
- **Risky**: Email existe mais propriétés suspectes
- **Undeliverable (Invalid)**: Email n'existe pas
- **Unknown**: Vérification impossible

## 🔧 Configuration

### Backend (`backend/backend_config.toml`)

```toml
backend_name = "production"
http_host = "0.0.0.0"
http_port = 8080

[throttle]
max_requests_per_minute = 100
max_requests_per_day = 10000
```

### Frontend (`.env`)

```bash
VITE_API_URL=https://votre-backend.fly.dev
```

## 📱 Utilisation

### Validation Unique
1. Onglet "Single Validation"
2. Saisir un email
3. Cliquer "Validate"

### Validation Bulk
1. Onglet "Bulk Validation"
2. Coller des emails ou uploader un CSV
3. Cliquer "Start Validation"
4. Télécharger les résultats en CSV

## 🆓 Coûts & Limites

### Plan Gratuit
- **Fly.io**: 3 apps, 160GB/mois
- **Vercel**: 100GB bandwidth/mois
- **Supabase**: 500MB base de données

Suffisant pour:
- Plusieurs milliers de validations/mois
- Usage personnel ou petit business

### Scaling
Pour plus de volume:
- Fly.io: $5-10/mois pour plus de ressources
- Vercel: Upgrade si besoin
- Workers RabbitMQ pour très gros volumes

## 🔐 Sécurité

- ✅ HTTPS automatique
- ✅ Rate limiting configuré
- ✅ Pas de stockage d'emails par défaut
- ✅ CORS configuré
- ⚠️ Ajoutez authentification pour usage public

## 📈 Performance

- Validation unique: 2-5 secondes
- Validation bulk: Parallèle, configurable
- Rate limiting pour protéger votre IP

## 🐛 Dépannage

### Backend ne démarre pas
```bash
flyctl logs -a votre-app
```

### Frontend ne se connecte pas
1. Vérifier `VITE_API_URL` dans Vercel
2. Tester l'API: `curl https://votre-backend.fly.dev/version`
3. Console navigateur pour erreurs

### Erreur CORS
Normalement géré automatiquement. Si problème:
- Vérifier que le backend accepte les requêtes
- Redéployer avec nouvelle config

## 📚 Documentation

- [Guide Déploiement Rapide](./DEPLOY_RAPIDE.md) - 10 minutes
- [Guide Déploiement Complet](./DEPLOY_ONLINE.md) - Toutes les options
- [Guide Développement](./EMAIL_VALIDATOR_README.md) - Documentation technique

## 🤝 Contribution

1. Fork le projet
2. Créez une branche: `git checkout -b feature/ma-fonctionnalite`
3. Commit: `git commit -m 'Ajout fonctionnalité'`
4. Push: `git push origin feature/ma-fonctionnalite`
5. Ouvrez une Pull Request

## 📄 License

MIT License - Voir LICENSE.md

## 🆘 Support

- **Issues**: Ouvrez une issue sur GitHub
- **Questions**: Discussions GitHub
- **Email**: support@votredomaine.com (si vous configurez)

## ⭐ Remerciements

- [Reacher](https://github.com/reacherhq/check-if-email-exists) - Email validation backend
- Communauté open-source

---

**Prêt à déployer? Suivez [DEPLOY_RAPIDE.md](./DEPLOY_RAPIDE.md)! 🚀**
