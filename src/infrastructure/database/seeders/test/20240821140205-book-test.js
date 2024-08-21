'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('book', [
      {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 1
      },
      {
        code: "FM-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 1
      },
      {
        code: "FM-43",
        title: "test title 3",
        author: "test author",
        stock: 0
      },
      {
        code: "FM-44",
        title: "test title 4",
        author: "test author",
        stock: 1
      },
      {
        code: "FM-46",
        title: "test title 4",
        author: "test author",
        stock: 1
      },

    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('book', {})
  }
};
