'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableNewsSubjects = 'news_subjects';
const _tableSubjects = 'subjects';
const _tableNews = 'news';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(_tableNewsSubjects, 'newsId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: _tableNews,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'newsId',
    });

    await queryInterface.changeColumn(_tableNewsSubjects, 'subjectId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: _tableSubjects,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'subjectId',
    });
  },
  async down(queryInterface, Sequelize) {},
};
