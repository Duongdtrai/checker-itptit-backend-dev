'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableMembers = 'members';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(_tableMembers, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      hometown: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      major: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      job: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      class: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      team: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      achievements: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quote: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isFamous: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable(_tableMembers);
  },
};
