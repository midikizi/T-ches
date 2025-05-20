const models = require('../../models');
const tacheRepository = require('../repositories/tacheRepository');

class TacheService {
    async validateTache(titre, description) {
        const errors = [];
        if (!titre || titre.trim().length < 3) {
            errors.push('Le titre doit contenir au moins 3 caractères');
        }
        if (!description || description.trim().length < 10) {
            errors.push('La description doit contenir au moins 10 caractères');
        }
        return errors;
    }

    async createTache(titre, description, userId) {
        const errors = await this.validateTache(titre, description);
        if (errors.length > 0) {
            throw {status:400,errors};
        }
        return await tacheRepository.create({titre, description, complete: false, userId});

    }

    async getALLTaches(){
        return await tacheRepository.findAll({
            attributes: ['id', 'titre', 'description', 'complete','userId'],
            include: [{
                model: models.User,
                attributes: ['id', 'username','isAdmin']
            }],
            order: [['id', 'DESC']]
        });
    }

    async getTacheById(id){
        const article = tacheRepository.findById(id, {
            attributes: ['id', 'titre', 'description', 'complete','userId'],
            include: [{
                model: models.User,
                attributes: ['id', 'username','isAdmin']
            }]
        });
        if (!article) {
            throw {status:404,errors:['Tache non trouvée']};
        }
        return article;
    }

    async updateTache(id, titre, description, complete, userId) {
        const tache = await tacheRepository.findOne({
            where: {id, userId},
            attributes: ['id', 'titre', 'description', 'complete', 'userId'],
        });
        if (!tache) {
            throw {status: 404, errors: ['Tache non trouvée']};
        }

        if (titre || description) {
            const errors = await this.validateTache(
                titre || tache.titre,
                description || tache.description
            );
            if (errors.length > 0) {
                throw {status: 400, errors};
            }
        }

        const updateData = {};
        if (titre) updateData.titre = titre;
        if (description) updateData.description = description;
        if (complete !== undefined) updateData.complete = complete;

        return await tacheRepository.update(id, updateData, {
            where: { userId }
        });
    }

    async deleteTache(id, userId) {
        const tache = await tacheRepository.findOne({
            where: {id, userId},
            attributes: ['id', 'titre', 'description', 'complete', 'userId'],
        });
        if (!tache) {
            throw {status: 404, errors: ['Tache non trouvée']};
        }
        return await tacheRepository.delete(tache);
    }
}

// Exporter une instance de la classe
module.exports = new TacheService();