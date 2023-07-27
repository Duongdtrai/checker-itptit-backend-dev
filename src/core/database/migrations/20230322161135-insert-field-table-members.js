'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableMembers = 'members';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(_tableMembers, 'hobby', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn(_tableMembers, 'description', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(_tableMembers, 'hobby'),
      queryInterface.removeColumn(_tableMembers, 'description'),
    ]);
  },
};
