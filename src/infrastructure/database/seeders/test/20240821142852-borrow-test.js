'use strict';

const date = require("../../../../interfaces/utils/date");
const {dueDateGenerator} = require("../../../../interfaces/utils/date");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const checkout = date.dueDateGenerator(-3)
    const dueDate = await dueDateGenerator(3)
    queryInterface.bulkInsert('borrow', [
      {
        id:1,
        user_id: "M001",
        book_id: "JK-45",
        checkout_at: '2024-08-21',
        due_date: '2024-08-28',
        return_date: null
      },
      {
        id:2,
        user_id: "M008",
        book_id: "FM-47",
        checkout_at: (await checkout).dueDate,
        due_date: (await dueDate).dueDate,
        return_date: null
      },
      {
        id:3,
        user_id: "M009",
        book_id: "FM-48",
        checkout_at: (await checkout).dueDate,
        due_date: (await dueDate).dueDate,
        return_date: null
      },
      {
        id:4,
        user_id: "M010",
        book_id: "FM-49",
        checkout_at: (await checkout).dueDate,
        due_date: (await dueDate).dueDate,
        return_date: null
      },{
        id:5,
        user_id: "M011",
        book_id: "FM-50",
        checkout_at: (await checkout).dueDate,
        due_date: (await dueDate).dueDate,
        return_date: new Date()
      },
      {
        id:6,
        user_id: "M012",
        book_id: "FM-51",
        checkout_at: (await checkout).dueDate,
        due_date: new Date(),
        return_date: null
      },{
        id:7,
        user_id: "M010",
        book_id: "FM-49",
        checkout_at: (await checkout).dueDate,
        due_date: (await dueDate).dueDate,
        return_date: null
      }

    ])
    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('borrow', 'id'),
        (SELECT MAX(id) FROM borrow)
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('borrow', {})
  }
};
