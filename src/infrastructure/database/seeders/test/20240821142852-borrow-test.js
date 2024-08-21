'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('borrow', [
      {
        user_id: "M001",
        book_id: "JK-45",
        checkout_at: '2024-08-21',
        due_date: '2024-08-28',
        return_date: null
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('borrow', {})
  }
};
