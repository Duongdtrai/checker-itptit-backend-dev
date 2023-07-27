'use strict';
/** @type {import('sequelize-cli').Migration} */

const _tableMemberSkills = 'members_skills';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(_tableMemberSkills, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      memberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'members',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      skillId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'skills',
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
    await queryInterface.dropTable(_tableMemberSkills);
  },
};
