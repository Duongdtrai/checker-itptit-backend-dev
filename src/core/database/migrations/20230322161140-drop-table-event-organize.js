'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableEvents = 'events';
const _tableOrganizations = 'organizations';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable(_tableEvents);
    await queryInterface.dropTable(_tableOrganizations);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(_tableEvents);
    await queryInterface.dropTable(_tableOrganizations);
  },
};
