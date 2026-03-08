# 🚀 Déploiement Rapide - 10 Minutes

Guide ultra-rapide pour mettre votre Email Validator en ligne.

## Méthode la Plus Simple (Recommandée)

### 1. Préparer le Code (2 min)

```bash
# Créer un repo GitHub
git init
git add .
git commit -m "Initial commit"

# Créer le repo sur GitHub et push
# Allez sur github.com/new
# Puis:
git remote add origin https://github.com/VOTRE-USERNAME/email-validator.git
git push -u origin main
```

### 2. Déployer le Backend sur Fly.io (4 min)

```bash
# Installer Fly CLI (une seule fois)
curl -L https://fly.io/install.sh | sh

# Se connecter (créer un compte si nécessaire)
flyctl auth login

# Déployer
cd backend
flyctl launch
# Suivez les instructions:
# - Nom de l'app: email-validator-backend (ou votre choix)
# - Région: choisissez la plus proche
# - Base de données: Non (ou Oui si vous voulez stocker les résultats)

# Déployer
flyctl deploy

# Copier l'URL affichée (ex: https://email-validator-backend.fly.dev)
```

### 3. Déployer le Frontend sur Vercel (4 min)

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Connectez-vous avec GitHub**
3. **Cliquez "Import Project"**
4. **Sélectionnez votre repo email-validator**
5. **Configuration**:
   - Root Directory: `frontend`
   - Framework: Vite (détecté automatiquement)
6. **Ajouter variable d'environnement**:
   - Nom: `VITE_API_URL`
   - Valeur: `https://VOTRE-APP.fly.dev` (l'URL de l'étape 2)
7. **Cliquez "Deploy"**

### ✅ C'est Tout!

Votre app est maintenant en ligne à l'URL fournie par Vercel!

## Encore Plus Rapide: Railway (Alternative)

Si Fly.io ne fonctionne pas:

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Déployer le backend
cd backend
railway init
railway up

# Récupérer l'URL
railway domain
```

Puis suivez l'étape 3 ci-dessus pour le frontend.

## Test

1. Ouvrez l'URL Vercel (ex: `https://votre-app.vercel.app`)
2. Testez avec un email: `test@gmail.com`
3. Testez la validation bulk

## Problème?

### Le backend ne répond pas
```bash
# Vérifier les logs
flyctl logs -a email-validator-backend
```

### Le frontend ne se connecte pas
1. Vérifiez que `VITE_API_URL` est bien définie dans Vercel
2. Allez dans Settings → Environment Variables sur Vercel
3. Redéployez: Deployments → ... → Redeploy

### Erreur CORS
Le backend doit accepter les requêtes de votre domaine Vercel. C'est normalement automatique.

## Mise à Jour

```bash
# Modifier le code
git add .
git commit -m "Update"
git push

# Frontend: se met à jour automatiquement
# Backend: redéployer
cd backend
flyctl deploy
```

## Domaine Personnalisé

### Sur Vercel
1. Settings → Domains
2. Ajoutez `votredomaine.com`
3. Configurez les DNS comme indiqué

## Coûts

- **Gratuit** pour un usage normal
- Fly.io: 3 apps gratuites
- Vercel: Bande passante illimitée (usage raisonnable)

## Support

Des questions? Voir `DEPLOY_ONLINE.md` pour plus de détails.

**Votre Email Validator est maintenant accessible partout dans le monde! 🌍**
