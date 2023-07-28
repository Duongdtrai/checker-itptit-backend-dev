'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skills extends Model {
    static associate(models) {
      Skills.belongsToMany(models.members, {
        through: models.members_skills,
        foreignKey: 'skillId',
      });
    }
  }
  Skills.init(
    {
      name: DataTypes.STRING,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'skills',
      timestamps: true,
      // paranoid: true,
    }
  );
  return Skills;
};
