'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: false,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        allowNull:false,
        primaryKey: true,
        defaultValue: Sequelize.literal('generate_user_code()')
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quota: {
        type: Sequelize.INTEGER,
        allowNull: false,
        minimum:0,
        defaultValue: 2
      },
      penalty_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        field: 'created_at',
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        onUpdate : Sequelize.literal('NOW()'),
        field: 'updated_at',
      },
      deleted_at:{
        allowNull: true,
        type: Sequelize.DATE,
        field: 'deleted_at',

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};