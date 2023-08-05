'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Viewers extends Model {
    static associate(models) {
      Viewers.belongsTo(models.members, {
        foreignKey: 'memberId',
      });
      Viewers.belongsTo(models.news, {
        foreignKey: 'newsId',
      });
    }
  }
  Viewers.init(
    {
      memberId: DataTypes.INTEGER,
      newsId: DataTypes.INTEGER,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'viewers',
      timestamps: true,
      // paranoid: true,
    }
  );
  return Viewers;
};
