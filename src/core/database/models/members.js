'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Members extends Model {
    static associate(models) {
      Members.belongsToMany(models.skills, {
        through: models.members_skills,
        foreignKey: 'memberId',
      });

      Members.belongsToMany(models.bands, {
        through: models.members_bands,
        foreignKey: 'memberId',
      });

      Members.belongsToMany(models.periods, {
        through: models.members_bands,
        foreignKey: 'memberId',
      });

      Members.hasMany(models.outstanding_members, {
        as: 'member',
        foreignKey: 'memberId',
      });

      Members.hasMany(models.news_comments, {
        foreignKey: 'memberId',
      });

      Members.belongsTo(models.users, {
        foreignKey: 'userId',
      });
    }
  }
  Members.init(
    {
      fullName: DataTypes.STRING,
      birthday: DataTypes.STRING,
      image: DataTypes.STRING,
      avatar: DataTypes.STRING,
      hometown: DataTypes.STRING,
      major: DataTypes.INTEGER,
      job: DataTypes.INTEGER,
      course: DataTypes.STRING,
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
