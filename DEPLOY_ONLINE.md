# Déployer Email Validator en Ligne (SaaS)

Ce guide vous aide à déployer l'application complète en ligne gratuitement.

## Architecture de Déploiement

- **Frontend**: Vercel (gratuit)
- **Backend**: Fly.io (gratuit jusqu'à 3 apps)
- **Database**: Supabase (déjà configuré)

## Prérequis

1. Compte GitHub
2. Compte Vercel (connecté à GitHub)
3. Compte Fly.io
4. Fly CLI installé

## Étape 1: Déployer le Backend sur Fly.io

### Installation de Fly CLI

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Connexion à Fly.io

```bash
flyctl auth login
```

### Déploiement du Backend

```bash
# Aller dans le dossier backend
cd backend

# Lancer l'app Fly.io (suivez les instructions)
flyctl launch --no-deploy

# Configurer les variables d'environnement
flyctl secrets set RCH__HTTP_HOST=0.0.0.0
flyctl secrets set RCH__HTTP_PORT=8080

# Déployer
flyctl deploy

# Obtenir l'URL de votre backend
flyctl info
# Notez l'URL, par exemple: https://email-validator-backend.fly.dev
```

### Configuration de la Base de Données (Optionnel)

Si vous voulez stocker les résultats:

```bash
# Créer une base de données Postgres sur Fly.io
flyctl postgres create

# Attacher la base de données
flyctl postgres attach <your-postgres-app>

# Les migrations se feront automatiquement au démarrage
```

## Étape 2: Déployer le Frontend sur Vercel

### Option A: Via GitHub (Recommandé)

1. Poussez votre code sur GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/email-validator.git
git push -u origin main
```

2. Allez sur [vercel.com](https://vercel.com)
3. Cliquez sur "Import Project"
4. Sélectionnez votre repo GitHub
5. Configurez:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Ajoutez la variable d'environnement:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://VOTRE-APP.fly.dev` (l'URL de votre backend)

7. Cliquez sur "Deploy"

### Option B: Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Aller dans le frontend
cd frontend

# Déployer
vercel

# Suivez les instructions
# Quand demandé, configurez:
# - Project name: email-validator
# - Directory: ./
# - Framework: Vite

# Définir la variable d'environnement
vercel env add VITE_API_URL

# Redéployer avec la nouvelle variable
vercel --prod
```

## Étape 3: Configuration CORS du Backend

Une fois déployé, vous devrez peut-être configurer CORS pour permettre les requêtes depuis votre frontend.

Créez un fichier `backend/backend_config.toml` avec:

```toml
backend_name = "production"
http_host = "0.0.0.0"
http_port = 8080

[throttle]
max_requests_per_minute = 100
max_requests_per_day = 10000
```

Puis redéployez:
```bash
cd backend
flyctl deploy
```

## Étape 4: Tester Votre Application

1. Visitez votre URL Vercel (ex: `https://email-validator.vercel.app`)
2. Testez la validation d'un email unique
3. Testez la validation en masse

## URLs de Votre Application

Après déploiement, vous aurez:

- **Frontend**: `https://VOTRE-APP.vercel.app`
- **Backend API**: `https://VOTRE-APP.fly.dev`
- **Database**: Supabase (déjà configuré)

## Coûts

Avec cette configuration:
- **Vercel**: Gratuit (100GB bandwidth/mois)
- **Fly.io**: Gratuit (3 apps, 160GB bandwidth/mois)
- **Supabase**: Gratuit dans ce projet

## Alternative: Déploiement sur Railway

Railway est une alternative à Fly.io, encore plus simple:

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Initialiser
cd backend
railway init

# Déployer
railway up

# Obtenir l'URL
railway domain
```

## Alternative Frontend: Netlify

Si vous préférez Netlify à Vercel:

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Se connecter
netlify login

# Déployer
cd frontend
netlify deploy --prod

# Suivre les instructions
```

## Mise à Jour de l'Application

### Backend
```bash
cd backend
flyctl deploy
```

### Frontend (si via Git)
```bash
git add .
git commit -m "Update"
git push
# Vercel déploie automatiquement
```

### Frontend (si via CLI)
```bash
cd frontend
vercel --prod
```

## Monitoring

### Backend (Fly.io)
```bash
# Voir les logs
flyctl logs

# Voir les métriques
flyctl status

# Voir les erreurs
flyctl logs --app email-validator-backend
```

### Frontend (Vercel)
- Dashboard: https://vercel.com/dashboard
- Analytics intégrés
- Logs en temps réel

## Dépannage

### Erreur CORS
Si vous avez des erreurs CORS, assurez-vous que:
1. La variable `VITE_API_URL` est correctement définie sur Vercel
2. Le backend accepte les requêtes de votre domaine frontend

### Backend ne démarre pas
```bash
# Vérifier les logs
flyctl logs

# Vérifier la configuration
flyctl config show

# Redémarrer
flyctl restart
```

### Frontend ne se connecte pas au Backend
1. Vérifiez l'URL du backend dans les variables Vercel
2. Testez l'API directement: `https://VOTRE-APP.fly.dev/version`
3. Vérifiez la console du navigateur pour les erreurs

## Domaine Personnalisé

### Vercel
1. Allez dans Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

### Fly.io
```bash
flyctl certs add yourdomain.com
flyctl certs add www.yourdomain.com
```

## Sécurité en Production

1. **Rate Limiting**: Configuré dans `backend_config.toml`
2. **HTTPS**: Automatique sur Vercel et Fly.io
3. **Secrets**: Utilisez `flyctl secrets set` pour les secrets backend
4. **Environment Variables**: Utilisez Vercel UI pour le frontend

## Support

- **Fly.io**: https://fly.io/docs
- **Vercel**: https://vercel.com/docs
- **Questions**: Créez une issue sur GitHub

Votre application est maintenant en ligne et accessible partout! 🚀
