'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableNews = 'news';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(_tableNews, 'title', {
      type: Sequelize.STRING(255),
      allowNull: false,
      after: 'id',
    });
  },
  async down(queryInterface, Sequelize) {},
};
