const bcrypt = require('bcrypt');
const jwtUtils = require('../../utils/jwt.utils');
const userRepository = require('../repositories/userRepository');
const { Sequelize } = require('sequelize');

class UserService {
    validateUserData(email, username, password) {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        if (!email || !emailRegex.test(email)) {
            errors.push('Email invalide');
        }
        if (!username || !usernameRegex.test(username)) {
            errors.push('Username doit contenir entre 3 et 20 caractères alphanumériques');
        }
        if (!password || password.length < 6) {
            errors.push('Mot de passe doit contenir au moins 6 caractères');
        }

        return errors;
    }

    async checkUserExists(email, username) {
        return await userRepository.findOne({
            where: {
                [Sequelize.Op.or]: [{ email }, { username }]
            }
        });
    }

    async register(email, username, password, bio = '') {
        // Validation des données
        const validationErrors = this.validateUserData(email, username, password);
        if (validationErrors.length > 0) {
            throw { status: 400, errors: validationErrors };
        }

        // Vérification de l'existence
        const existingUser = await this.checkUserExists(email, username);
        if (existingUser) {
            throw { 
                status: 409, 
                error: `${existingUser.email === email ? 'Email' : 'Username'} déjà utilisé`
            };
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const newUser = await userRepository.create({
            email,
            username,
            password: hashedPassword,
            bio,
            isAdmin: false  // Correction de 'isAdimin' en 'isAdmin'
        });

        return {
            userId: newUser.id,
            token: jwtUtils.generateTokenForUser(newUser)
        };
    }

    async login(username, password) {
        if (!username || !password) {
            throw { status: 400, error: 'Paramètres manquants' };
        }

        const user = await userRepository.findByUsername(username);
        if (!user) {
            throw { status: 404, error: 'Utilisateur non trouvé' };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw { status: 401, error: 'Mot de passe incorrect' };
        }

        return {
            userId: user.id,
            token: jwtUtils.generateTokenForUser(user)
        };
    }

    async getUserProfile(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw { status: 404, error: 'Utilisateur non trouvé' };
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            bio: user.bio,
            isAdmin: user.isAdimin
        };
    }

    async updateProfile(userId, data) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw { status: 404, error: 'Utilisateur non trouvé' };
        }

        // Si l'email ou le username change, vérifier qu'ils sont disponibles
        if (data.email || data.username) {
            const existingUser = await this.checkUserExists(
                data.email || user.email,
                data.username || user.username
            );
            if (existingUser && existingUser.id !== userId) {
                throw { 
                    status: 409, 
                    error: `${existingUser.email === (data.email || user.email) ? 'Email' : 'Username'} déjà utilisé`
                };
            }
        }

        // Si le mot de passe change, le hasher
        if (data.password) {
            if (data.password.length < 6) {
                throw { status: 400, error: 'Mot de passe doit contenir au moins 6 caractères' };
            }
            data.password = await bcrypt.hash(data.password, 10);
        }

        await userRepository.update(user, data);
        return await this.getUserProfile(userId);
    }
}

module.exports = new UserService();