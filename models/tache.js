'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tache extends Model {
    static associate(models) {
      // define association here
      tache.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  }
  tache.init({
    titre: DataTypes.STRING,
    description: DataTypes.STRING,
    complete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'tache',
  });
  return tache;
};