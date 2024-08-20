const {
    sequelize,

} = require("../../infrastructure/database/models/index.js");

const models = require('../../infrastructure/database/models/index.js');
const Borrow = models.Borrow

const insert = async ({params, requestId, transaction=null}) => {
  try{
      const options = {}

      if (transaction){
          options.transaction = transaction;
          options.lock = transaction.LOCK.UPDATE
      }
      return await Borrow.create(params, options);
  }catch (error) {
      console.error(`Request ID: ${requestId} - Insert Book Repository error:`, error.message);
      throw new Error("Database query error: " + error.message);
  }
}
module.exports={
    insert
}
