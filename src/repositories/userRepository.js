const models = require('../../models');

class UserRepository {
    async create(userData) {
        return await models.User.create(userData);
    }

    async findByUsername(username) {
        return await models.User.findOne({ where: { username } });
    }

    async findById(id) {
        return await models.User.findByPk(id);
    }

    async findOne(options) {
        return await models.User.findOne(options);
    }

    async update(user, data) {
        return await user.update(data);
    }

    async delete(user) {
        return await user.destroy();
    }
}

module.exports = new UserRepository();