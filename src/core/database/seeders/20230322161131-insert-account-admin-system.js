'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const _systemAdminUsername = process.env.SYSTEM_ADMIN_USERNAME;
const _systemAdminEmail = process.env.SYSTEM_ADMIN_EMAIL;
const _systemAdminPassword = process.env.SYSTEM_ADMIN_PASSWORD;
const _tableNameUsers = 'users';
const _tableMembers = 'members';
const {
  SYSTEM_ADMIN,
  USER_STATUS,
} = require('../../../api/cms/user/user.constant');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const userId = await queryInterface.bulkInsert(
        _tableNameUsers,
        [
          {
            email: _systemAdminEmail.toLowerCase(),
            username: _systemAdminUsername,
            password: bcrypt.hashSync(
              _systemAdminPassword,
              bcrypt.genSaltSync(10)
            ),
            role: SYSTEM_ADMIN.ADMIN,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {
          returning: true,
          transaction,
        }
      );
      console.log('userId', userId);
      await queryInterface.bulkInsert(
        _tableMembers,
        [
          {
            userId,
            fullName: 'ITPTIT',
            gender: 1,
            birthday: '2002-03-06',
            image: null,
            hometown: null,
            major: 'IT',
            job: 'Developer Fullstack',
            course: 'D20CQCN07-B',
            team: 4,
            hobby: 'Baby girl',
            achievements: null,
            description: null,
            quote: null,
            isFamous: 2,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {
          returning: true,
          transaction,
        }
      );
      await transaction.commit();
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.resolve(true);
  },
};
