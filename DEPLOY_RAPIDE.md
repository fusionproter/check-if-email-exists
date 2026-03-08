# 🚀 Déploiement Rapide - Backend Rust

**IMPORTANT:** Vous devez être dans le dossier `backend/` pour déployer!

## L'Erreur que Vous Avez Eue

```
Error: file Cargo.toml does not contain a valid package section
```

**Pourquoi?** Le `Cargo.toml` à la racine est un workspace, pas un package.

**Solution:** Allez dans le dossier `backend/` qui contient le vrai package!

---

## Déploiement en 3 Commandes

```bash
# 1. IMPORTANT: Aller dans le dossier backend!
cd backend

# 2. Se connecter à Fly.io
fly auth login

# 3. Déployer
fly deploy
```

**C'est tout!** Fly.io utilisera le `fly.toml` qui existe déjà.

---

## Après le Déploiement

Fly.io vous donnera une URL comme:
```
https://email-validator-backend.fly.dev
```

### Configurer l'URL dans Supabase

**Via Dashboard Supabase (plus facile):**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. **Settings** → **Edge Functions**
4. Ajoutez cette variable:
   - **Name:** `REACHER_BACKEND_URL`
   - **Value:** `https://votre-app.fly.dev`
5. Cliquez **Save**

**Via CLI Supabase:**
```bash
supabase secrets set REACHER_BACKEND_URL=https://votre-app.fly.dev
```

### ✅ Terminé!

Votre application utilisera maintenant le vrai backend Rust pour la validation!

## Tester le Backend

```bash
# Vérifier que le backend est en ligne
curl https://votre-app.fly.dev/version

# Tester une validation d'email
curl -X POST https://votre-app.fly.dev/v0/check_email \
  -H "Content-Type: application/json" \
  -d '{"to_email": "test@gmail.com"}'
```

Vous devriez voir un JSON avec la validation complète!

---

## Problèmes Courants

### "app already exists"

L'app existe déjà, utilisez juste:
```bash
cd backend
fly deploy
```

### "not logged in"

```bash
fly auth login
```

### Voir les logs du backend

```bash
cd backend
fly logs
```

### Vérifier le statut

```bash
cd backend
fly status
```

### Le backend consomme trop de mémoire

Augmenter la RAM:
```bash
cd backend
fly scale memory 2048
```

---

## Configuration Production (Optionnel)

Pour améliorer la déliverabilité, vous pouvez configurer des variables d'environnement:

```bash
cd backend

# Configurer via secrets Fly.io
fly secrets set RCH__HELLO_NAME=votre-domaine.com
fly secrets set RCH__FROM_EMAIL=noreply@votre-domaine.com
fly secrets set RCH__SMTP_TIMEOUT=45
```

Ou éditez `backend/fly.toml`:
```toml
[env]
  PORT = "8080"
  RCH__HELLO_NAME = "votre-domaine.com"
  RCH__FROM_EMAIL = "noreply@votre-domaine.com"
```

Puis redéployez:
```bash
fly deploy
```

---

## Mise à Jour du Backend

```bash
cd backend
fly deploy
```

---

## Alternative: Railway

Si Fly.io ne fonctionne pas (port 25 bloqué dans certaines régions):

```bash
# Installer Railway CLI
npm i -g @railway/cli

cd backend

# Se connecter
railway login

# Créer le projet
railway init

# Déployer
railway up

# Obtenir l'URL
railway domain
```

Ensuite, configurez l'URL dans Supabase comme expliqué ci-dessus.

---

## Architecture Finale

```
Frontend (hébergé sur Vercel/Netlify)
    ↓
Supabase Edge Functions (proxy TypeScript)
    ↓
Backend Rust sur Fly.io (check-if-email-exists)
    ↓
Serveurs SMTP (Gmail, Yahoo, Outlook...)
```

---

## Coûts

- **Fly.io:** Gratuit jusqu'à 3 apps (RAM limitée)
- **Supabase:** Gratuit jusqu'à 500MB database + 2GB bandwidth
- **Frontend:** Gratuit sur Vercel/Netlify

**Total: GRATUIT pour usage normal! 🎉**

---

## Support

- Guide complet: `SETUP_INSTRUCTIONS.md`
- Configuration détaillée: `BACKEND_SETUP.md`
- Corrections: `FIXED.md`

**Votre Email Validator utilise maintenant la vraie validation SMTP! 🚀**
