'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableNews = 'news';
const _tableOrganizations = 'organizations';
const _tableEvents = 'events';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(_tableNews, 'organizationId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: _tableOrganizations,
          key: 'id',
        },
      }),
      queryInterface.addColumn(_tableNews, 'eventId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: _tableEvents,
          key: 'id',
        },
      }),
      queryInterface.addColumn(_tableNews, 'isPublic', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      }),
      queryInterface.addColumn(_tableNews, 'views', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(_tableNews, 'organizationId'),
      queryInterface.removeColumn(_tableNews, 'eventId'),
      queryInterface.removeColumn(_tableNews, 'isPublic'),
    ]);
  },
};
