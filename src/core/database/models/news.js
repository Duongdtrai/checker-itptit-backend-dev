'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      News.hasMany(models.thumbnails, {
        as: 'thumbnails',
        foreignKey: 'newsId',
      });
      News.hasMany(models.news_comments, {
        foreignKey: 'newsId',
      });

      News.belongsToMany(models.subjects, {
        foreignKey: 'newsId',
        through: 'news_subjects',
        as: 'list_subjects',
      });

      News.hasMany(models.viewers, {
        foreignKey: 'newsId',
      });
    }
  }
  News.init(
    {
      title: DataTypes.STRING,
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
