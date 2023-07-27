'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserVerifications extends Model {
    static associate(models) {
      UserVerifications.belongsTo(models.user_verifications, {
        as: 'user',
        foreignKey: 'userId',
      });
    }
  }
  UserVerifications.init(
    {
      userId: DataTypes.INTEGER,
      uniqueString: DataTypes.STRING,
      expiredAt: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'user_verifications',
      timestamps: true,
      // paranoid: true,
    }
  );
  return UserVerifications;
};
