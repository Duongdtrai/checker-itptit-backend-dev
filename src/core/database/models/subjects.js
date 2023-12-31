'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subjects extends Model {
    static associate(models) {
      Subjects.belongsToMany(models.news, {
        foreignKey: 'subjectId',
        through: 'news_subjects',
        as: 'list_news',
      });
    }
  }
  Subjects.init(
    {
      name: DataTypes.STRING,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'subjects',
      timestamps: true,
      // paranoid: true,
    }
  );
  return Subjects;
};
