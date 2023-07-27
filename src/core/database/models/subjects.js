'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subjects extends Model {
    static associate(models) {}
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
