'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableUsers = 'users';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(_tableUsers, 'isActivated')
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(_tableUsers, 'isActivated')
  },
};
