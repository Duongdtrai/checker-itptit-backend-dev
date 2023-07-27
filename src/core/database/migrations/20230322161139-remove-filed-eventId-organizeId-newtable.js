'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableNews = 'news';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(_tableNews, 'organizationId')
    await queryInterface.removeColumn(_tableNews, 'eventId')
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(_tableNews, 'organizationId')
    await queryInterface.removeColumn(_tableNews, 'eventId')
  },
};
