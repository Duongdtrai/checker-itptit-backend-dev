'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsSubjects extends Model {
    static associate(models) {}
  }
  NewsSubjects.init(
    {
      newsId: DataTypes.INTEGER,
      subjectId: DataTypes.INTEGER,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'news_subjects',
      timestamps: true,
      // paranoid: true,
    }
  );
  return NewsSubjects;
};
