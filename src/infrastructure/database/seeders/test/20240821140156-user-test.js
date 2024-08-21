'use strict';
const date = require('../../../../interfaces/utils/date')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {now,dueDate} = await date.dueDateGenerator(3)

    const expired = date.dueDateGenerator(-3)

    return queryInterface.bulkInsert('user', [
      {code: "M001", name:'Angga', quota:2 },
      {code: "M002", name:'Johj', quota:0 },
      {code: "M003", name:'Doe', quota:2, penalty_date: dueDate },
      {code: "M004", name:'Soe', quota:2, penalty_date: (await expired).dueDate },
      {code: "M005", name:'Koe', quota:2 },
      {code: "M006", name:'Koe', quota:2 },
      {code: "M007", name:'Koe', quota:2 },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', {})
  }
};
