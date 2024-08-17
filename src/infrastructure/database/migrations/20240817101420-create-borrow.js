'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('borrows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      book_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "books",
          key: 'code'
        }
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: 'code'
        }
      },
      checkout_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        onUpdate : Sequelize.literal('NOW()'),
      },
      deletedAt:{
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('borrows');
  }
};