#!/bin/bash

echo "🚀 Email Validator - Script de Déploiement"
echo ""
echo "Choisissez une option:"
echo "1. Déployer le backend sur Fly.io"
echo "2. Déployer le frontend sur Vercel"
echo "3. Déployer les deux"
echo "4. Voir les logs du backend"
echo "5. Voir le statut"
echo ""
read -p "Votre choix (1-5): " choice

case $choice in
  1)
    echo "📦 Déploiement du backend..."
    cd backend
    flyctl deploy
    echo "✅ Backend déployé!"
    ;;
  2)
    echo "📦 Déploiement du frontend..."
    cd frontend
    vercel --prod
    echo "✅ Frontend déployé!"
    ;;
  3)
    echo "📦 Déploiement complet..."
    cd backend
    flyctl deploy
    cd ../frontend
    vercel --prod
    echo "✅ Tout est déployé!"
    ;;
  4)
    echo "📋 Logs du backend..."
    cd backend
    flyctl logs
    ;;
  5)
    echo "📊 Statut..."
    cd backend
    flyctl status
    cd ../frontend
    echo ""
    echo "Frontend: Vérifiez sur vercel.com/dashboard"
    ;;
  *)
    echo "❌ Option invalide"
    exit 1
    ;;
esac
