'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {name:'Angga', quota:2 },
      {name:'Ferry', quota:2 },
      {name:'Putri', quota:2 },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  }
};
