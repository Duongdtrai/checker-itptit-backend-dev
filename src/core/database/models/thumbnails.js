'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thumbnails extends Model {
    static associate(models) {
      Thumbnails.belongsTo(models.news, {
        as: 'new',
        foreignKey: 'newsId',
      });
    }
  }
  Thumbnails.init(
    {
      url: DataTypes.TEXT,
      newsId: DataTypes.INTEGER,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'thumbnails',
      timestamps: true,
      // paranoid: true,
    }
  );
  return Thumbnails;
};
