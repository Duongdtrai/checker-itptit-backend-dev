'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableMembers = 'members';
module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.renameColumn(_tableMembers, 'class', 'course')
  },
  async down(queryInterface, Sequelize) {
   await queryInterface.renameColumn(_tableMembers, 'class', 'course')
  },
};
