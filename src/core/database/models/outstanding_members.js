'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OutstandingMembers extends Model {
    static associate(models) {
      OutstandingMembers.belongsTo(models.members, {
        as: 'member',
        foreignKey: 'memberId',
      });
    }
  }
  OutstandingMembers.init(
    {
      memberId: DataTypes.INTEGER,
      time: DataTypes.STRING,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'outstanding_members',
      timestamps: true,
      // paranoid: true,
    }
  );
  return OutstandingMembers;
};
