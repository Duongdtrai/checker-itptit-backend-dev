'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableNewsSubjects = 'news_subjects';
const _tableSubjects = 'subjects';
const _tableNews = 'news';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(_tableNewsSubjects, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      newsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: _tableNews,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: _tableSubjects,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable(_tableNewsSubjects);
  },
};
