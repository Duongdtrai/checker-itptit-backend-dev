'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableMembers = 'members';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(_tableMembers, 'phoneNumber', {
        type: Sequelize.STRING(255),
        allowNull: true,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn(_tableMembers, 'phoneNumber')]);
  },
};
