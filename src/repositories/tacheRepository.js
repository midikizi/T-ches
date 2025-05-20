const models = require('../../models');

class TacheRepository {
    async create(tacheData){
        return await models.tache.create(tacheData,{
            returning: ['id', 'titre', 'description', 'complete']
        });
    }

    async findAll(options = {}){
        return await models.tache.findAll(options);
    }

    async findById(id, options = {}){
        return await models.tache.findByPk(id, options);
    }

    async findOne(options = {}){
        return await models.tache.findOne(options);
    }

    async update(id, data, options = {}){
        return await models.tache.update(data, {
            where: { id, ...options.where },
            returning: true
        });
    }

    async delete(tache){
        return await tache.destroy();
    }
}

module.exports = new TacheRepository();