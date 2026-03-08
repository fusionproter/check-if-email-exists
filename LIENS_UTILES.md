# 🔗 Liens et Commandes Utiles

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| [DEMARRAGE.md](./DEMARRAGE.md) | Guide de démarrage complet avec checklist |
| [DEPLOY_RAPIDE.md](./DEPLOY_RAPIDE.md) | Déploiement en 10 minutes |
| [DEPLOY_ONLINE.md](./DEPLOY_ONLINE.md) | Guide détaillé de déploiement |
| [README_SAAS.md](./README_SAAS.md) | Documentation complète SaaS |
| [EMAIL_VALIDATOR_README.md](./EMAIL_VALIDATOR_README.md) | Documentation technique |

## 🌐 Services de Déploiement

### Fly.io (Backend)
- **Site**: https://fly.io
- **Dashboard**: https://fly.io/dashboard
- **Docs**: https://fly.io/docs
- **Pricing**: https://fly.io/docs/about/pricing/

### Vercel (Frontend)
- **Site**: https://vercel.com
- **Dashboard**: https://vercel.com/dashboard
- **Docs**: https://vercel.com/docs
- **Pricing**: Gratuit pour usage personnel

### Alternatives

#### Railway (Backend)
- **Site**: https://railway.app
- **Dashboard**: https://railway.app/dashboard
- **Plus simple que Fly.io**

#### Netlify (Frontend)
- **Site**: https://netlify.com
- **Dashboard**: https://app.netlify.com
- **Alternative à Vercel**

## ⚡ Commandes Essentielles

### Installation Initiale

```bash
# Frontend
cd frontend
npm install

# Backend (vérifier Rust)
rustc --version
cargo --version
```

### Développement Local

```bash
# Frontend (Terminal 1)
cd frontend
npm run dev
# Ouvre http://localhost:5173

# Backend (Terminal 2)
cd backend
cargo run
# API sur http://localhost:8080
```

### Build Local

```bash
# Frontend
cd frontend
npm run build
# Fichiers dans dist/

# Backend
cd backend
cargo build --release
# Binary dans target/release/
```

### Déploiement

```bash
# Backend sur Fly.io
cd backend
flyctl deploy

# Frontend sur Vercel
cd frontend
vercel --prod

# Ou utilisez le script
./deploy.sh
```

### Debugging

```bash
# Logs Backend (Fly.io)
flyctl logs -a VOTRE-APP

# Status Backend
flyctl status -a VOTRE-APP

# Redémarrer Backend
flyctl restart -a VOTRE-APP

# Shell sur le serveur
flyctl ssh console -a VOTRE-APP
```

### Mise à Jour

```bash
# Sauvegarder et push
git add .
git commit -m "Update"
git push

# Backend: redéployer
cd backend
flyctl deploy

# Frontend: automatique si connecté à GitHub
# Ou manuellement:
cd frontend
vercel --prod
```

## 🔧 Configuration

### Variables d'Environnement

**Frontend (Vercel)**:
```
VITE_API_URL=https://votre-app.fly.dev
```

**Backend (Fly.io)**:
```bash
flyctl secrets set KEY=VALUE -a VOTRE-APP
```

### Fichiers de Config Importants

| Fichier | Usage |
|---------|-------|
| `frontend/.env` | Variables locales frontend |
| `frontend/vercel.json` | Config Vercel |
| `frontend/netlify.toml` | Config Netlify |
| `backend/fly.toml` | Config Fly.io |
| `backend/railway.json` | Config Railway |
| `backend/backend_config.toml` | Config app backend |

## 🔍 URLs de Test

### Tester l'API Backend

```bash
# Version
curl https://VOTRE-APP.fly.dev/version

# Validation unique
curl -X POST https://VOTRE-APP.fly.dev/v1/check_email \
  -H "Content-Type: application/json" \
  -d '{"to_email":"test@gmail.com"}'

# Créer job bulk
curl -X POST https://VOTRE-APP.fly.dev/v1/bulk \
  -H "Content-Type: application/json" \
  -d '{"input":["test1@gmail.com","test2@yahoo.com"]}'
```

### Tester le Frontend

1. Ouvrir `https://votre-app.vercel.app`
2. Onglet "Single Validation"
3. Tester avec `test@gmail.com`
4. Onglet "Bulk Validation"
5. Coller plusieurs emails

## 📦 Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Backend | Rust, Warp, Tokio |
| Email Validation | check-if-email-exists |
| Frontend | React 19, Vite 7 |
| Database | Supabase PostgreSQL (optionnel) |
| Hosting Backend | Fly.io / Railway |
| Hosting Frontend | Vercel / Netlify |

## 🎯 Endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/version` | GET | Version de l'API |
| `/v1/check_email` | POST | Valider un email |
| `/v1/bulk` | POST | Créer job bulk |
| `/v1/bulk/{id}` | GET | Statut job |
| `/v1/bulk/{id}/results` | GET | Télécharger résultats |

## 💡 Tips

### Domaine Personnalisé

**Vercel**:
1. Settings → Domains
2. Ajouter `votredomaine.com`
3. Configurer DNS (A/CNAME records fournis)

**Fly.io**:
```bash
flyctl certs add votredomaine.com -a VOTRE-APP
```

### Activer HTTPS

- **Vercel**: Automatique
- **Fly.io**: Automatique avec Let's Encrypt

### Monitoring

**Fly.io**:
```bash
# Métriques
flyctl metrics -a VOTRE-APP

# Voir les apps
flyctl apps list
```

**Vercel**:
- Dashboard → Analytics
- Dashboard → Speed Insights

### Réduire les Coûts

1. **Auto-stop** sur Fly.io (déjà configuré dans fly.toml)
2. **Caching** sur Vercel (automatique)
3. **Optimiser les images** (si vous en ajoutez)

### Sécurité

```toml
# Dans backend_config.toml
[throttle]
max_requests_per_minute = 100
max_requests_per_day = 10000
```

## 🆘 Support

| Problème | Solution |
|----------|----------|
| Build fail | Vérifier logs, `npm install`, `cargo clean` |
| CORS error | Vérifier `VITE_API_URL` sur Vercel |
| 404 backend | Vérifier `flyctl status` |
| Lent | Vérifier région Fly.io (choisir proche) |

### Communauté

- **Fly.io Community**: https://community.fly.io
- **Vercel Discord**: https://vercel.com/discord
- **Issues GitHub**: Créez une issue

## 📊 Monitoring Production

### KPIs à Surveiller

- Temps de réponse API
- Taux d'erreur
- Nombre de validations/jour
- Bandwidth utilisé

### Outils

- **Fly.io**: Métriques intégrées
- **Vercel**: Analytics intégrés
- **Optionnel**: Sentry, LogRocket, etc.

## 🎓 Ressources Apprentissage

### Rust
- https://doc.rust-lang.org/book/
- https://www.rust-lang.org/learn

### React
- https://react.dev
- https://vitejs.dev

### Déploiement
- https://fly.io/docs
- https://vercel.com/docs

---

**Gardez ce fichier à portée de main! Il contient tout ce dont vous avez besoin. 📌**
