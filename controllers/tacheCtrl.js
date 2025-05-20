const express = require('express');
const tacheService = require('../src/services/tacheService');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, async (req, res) => {
    try {
        const { titre, description } = req.body;
        const tache = await tacheService.createTache(titre, description, req.user.id);
        res.status(201).json(tache);
    } catch(error) {
       console.error('erreur de creation de tache', error);
       res.status(error.status || 500).json(error.errors ? { errors: error.errors } : { 'error': 'Impossible de créer l\'article' });
    }
});

router.get('/get', auth, async (req, res) => {
    try {
        const tache = await tacheService.getALLTaches();
        res.status(200).json(tache);
    } catch(error) {
        console.error('erreur de recuperation de tache', error);
        res.status(error.status || 500).json(error.errors ? { errors: error.errors } : { 'error': 'Impossible de recuperer les taches' });
    }
});

router.get('/:id',auth, async (req, res) => {
    try{
        const tache = await tacheService.getTacheById(req.params.id);
        res.status(200).json(tache);
    }catch(error){
        console.error('erreur de recuperation de tache', error);
        res.status(error.status || 500).json(error.errors? { errors: error.errors } : { 'error': 'Impossible de recuperer la tache' });
    }
});

router.put('/:id',auth, async (req, res) => {
    try{
        const{titre, description, complete} = req.body;
        const tache = await tacheService.updateTache(req.params.id, titre, description, complete, req.user.id);
        res.status(200).json(tache);
    }catch(error){
        console.error('erreur de modification de tache', error);
        res.status(error.status || 500).json(error.errors? { errors: error.errors } : { 'error': 'Impossible de modifier la tache' });
    }
});

router.delete('/:id',auth, async (req, res) => {
    try{
        const tache = await tacheService.deleteTache(req.params.id, req.user.id);
        res.status(200).json(tache);
    }catch(error){
        console.error('erreur de suppression de tache', error);
        res.status(error.status || 500).json(error.errors? { errors: error.errors } : { 'error': 'Impossible de supprimer la tache' });
    }
});

module.exports = router;