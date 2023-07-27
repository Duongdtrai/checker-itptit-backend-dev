'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MembersSkills extends Model {
    static associate(models) {}
  }
  MembersSkills.init(
    {
      memberId: DataTypes.INTEGER,
      skillId: DataTypes.INTEGER,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'members_skills',
      timestamps: true,
      // paranoid: true,
    }
  );
  return MembersSkills;
};
