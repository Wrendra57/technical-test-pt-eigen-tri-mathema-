'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION generate_user_code()
      RETURNS TEXT AS $$
      DECLARE
          seq_num INT;
          user_code TEXT;
      BEGIN
          seq_num = currval('user_id_seq');
          
          IF seq_num <= 999 THEN
              user_code = 'M' || LPAD(seq_num::TEXT, 3, '0');
          ELSE
              user_code = 'M' || seq_num::TEXT;
          END IF;
          
          RETURN user_code;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS generate_user_code();
    `);
  }
};
