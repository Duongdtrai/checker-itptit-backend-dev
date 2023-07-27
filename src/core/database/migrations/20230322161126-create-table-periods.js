'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tablePeriods = 'periods';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(_tablePeriods, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      endedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      startedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      isDeleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(_tablePeriods);
  },
};
