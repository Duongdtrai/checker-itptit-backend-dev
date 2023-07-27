'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Members extends Model {
    static associate(models) {
      Members.belongsToMany(models.skills, {
        through: models.members_skills,
        as: 'memberSkill',
        foreignKey: 'memberId',
      });

      Members.belongsToMany(models.bands, {
        through: models.members_bands,
        as: 'memberBand',
        foreignKey: 'memberId',
      });

      Members.hasMany(models.outstanding_members, {
        as: 'member',
        foreignKey: 'memberId',
      });
    }
  }
  Members.init(
    {
      fullName: DataTypes.STRING,
      birthday: DataTypes.STRING,
      image: DataTypes.STRING,
      hometown: DataTypes.STRING,
      major: DataTypes.INTEGER,
      job: DataTypes.INTEGER,
      class: DataTypes.STRING,
      team: DataTypes.INTEGER,
      achievements: DataTypes.STRING,
      quote: DataTypes.STRING,
      hobby: DataTypes.STRING,
      description: DataTypes.STRING,
      gender: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      isFamous: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'members',
      timestamps: true,
      // paranoid: true,
    }
  );
  return Members;
};
