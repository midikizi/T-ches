# Gestionnaire de Tâches API

Une API RESTful pour la gestion de tâches personnelles, développée avec Node.js, Express et Sequelize.

## Fonctionnalités

- 👤 Authentification des utilisateurs (inscription, connexion)
- ✅ Gestion des tâches (CRUD)
- 🔒 Protection des routes avec JWT
- 📝 Validation des données
- 🗃️ Stockage des données avec MySQL

## Prérequis

- Node.js (v14 ou supérieur)
- MySQL

## Installation

1. Clonez le repository
2. Installez les dépendances :
```bash
npm install
````

## Architecture

├── config/
│   └── config.json         # Configuration de la base de données
├── controllers/
│   ├── tacheCtrl.js        # Contrôleur des tâches
│   └── usersCtrl.js        # Contrôleur des utilisateurs
├── middleware/
│   └── auth.js             # Middleware d'authentification
├── migrations/             # Migrations Sequelize
├── models/                 # Modèles Sequelize
├── src/
│   ├── repositories/       # Couche d'accès aux données
│   └── services/           # Logique métier
└── utils/
    └── jwt.utils.js        # Utilitaires JWT
