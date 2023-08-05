'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bands extends Model {
    static associate(models) {
      Bands.belongsToMany(models.members, {
        through: models.members_bands,
        foreignKey: 'bandId',
      });
    }
  }
  Bands.init(
    {
      name: DataTypes.STRING,
      priority: DataTypes.INTEGER,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'bands',
      timestamps: true,
      // paranoid: true,
    }
  );
  return Bands;
};
