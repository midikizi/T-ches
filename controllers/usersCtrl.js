const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userService = require('../src/services/userService');

// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        const { email, username, password, bio } = req.body;
        const result = await userService.register(email, username, password, bio);
        res.status(201).json(result);
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(error.status || 500).json(
            error.errors ? { errors: error.errors } : { 'error': error.error || 'Erreur lors de l\'inscription' }
        );
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await userService.login(username, password);
        res.status(200).json(result);
    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(error.status || 500).json({ 'error': error.error || 'Erreur lors de la connexion' });
    }
});

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await userService.getUserProfile(req.user.id);
        res.status(200).json(profile);
    } catch (error) {
        console.error('Erreur récupération profil:', error);
        res.status(error.status || 500).json({ 'error': error.error || 'Erreur lors de la récupération du profil' });
    }
});

// Route pour mettre à jour le profil
router.put('/me', auth, async (req, res) => {
    try {
        const { email, username, password, bio } = req.body;
        const profile = await userService.updateProfile(req.user.id, {
            email,
            username,
            password,
            bio
        });
        res.status(200).json(profile);
    } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        res.status(error.status || 500).json({ 'error': error.error || 'Erreur lors de la mise à jour du profil' });
    }
});

module.exports = router;