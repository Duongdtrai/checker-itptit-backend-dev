'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MembersBands extends Model {
    static associate(models) {
      MembersBands.belongsTo(models.periods, {
        foreignKey: 'periodId',
        as: 'periodMemberBand',
      });
    }
  }
  MembersBands.init(
    {
      memberId: DataTypes.INTEGER,
      bandId: DataTypes.INTEGER,
      periodId: DataTypes.INTEGER,
      role: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'members_bands',
      timestamps: true,
      // paranoid: true,
    }
  );
  return MembersBands;
};
