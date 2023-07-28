'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsComments extends Model {
    static associate(models) {
      NewsComments.belongsTo(models.members, {
        foreignKey: 'memberId',
      });
      NewsComments.belongsTo(models.news, {
        foreignKey: 'newsId',
      });
    }
  }
  NewsComments.init(
    {
      memberId: DataTypes.INTEGER,
      newsId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'news_comments',
      timestamps: true,
      // paranoid: true,
    }
  );
  return NewsComments;
};
