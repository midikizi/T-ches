const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');

module.exports = (req, res, next) => {
    try {
        const userId = jwtUtils.getUserId(req.headers.authorization);
        if (userId < 0) {
            throw 'Token invalide';
        }

        models.User.findByPk(userId)
            .then(user => {
                if (!user) {
                    throw 'Utilisateur non trouvé';
                }
                req.user = user;
                next();
            })
            .catch(error => res.status(401).json({ error: 'Utilisateur non trouvé' }));

    } catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée' });
    }
};  