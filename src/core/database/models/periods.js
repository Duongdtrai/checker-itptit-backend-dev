'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Periods extends Model {
    static associate(models) {
      Periods.hasMany(models.members_bands, {
        foreignKey: 'periodId',
        as: 'periodMemberBand',
      });
    }
  }
  Periods.init(
    {
      endedAt: DataTypes.BOOLEAN,
      startedAt: DataTypes.BOOLEAN,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'periods',
      timestamps: true,
      // paranoid: true,
    }
  );
  return Periods;
};
