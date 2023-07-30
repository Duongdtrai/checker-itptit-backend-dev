'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasOne(models.members, {
        as: 'member',
        foreignKey: 'userId',
      });

      Users.hasOne(models.user_verifications, {
        as: 'user',
        foreignKey: 'userId',
      });
    }
  }
  Users.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'users',
      timestamps: true,
      // paranoid: true,
    }
  );
  return Users;
};
