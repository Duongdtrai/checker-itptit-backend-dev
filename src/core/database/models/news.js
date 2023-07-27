'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      News.hasMany(models.thumbnails, {
        as: 'thumbnails',
        foreignKey: 'newsId',
      });
    }
  }
  News.init(
    {
      content: DataTypes.TEXT,
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'news',
      timestamps: true,
      // paranoid: true,
    }
  );
  return News;
};
