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
      console.log(error)
      console.error(`Request ID: ${requestId} - Insert Borrow Repository error:`, error.message);
      throw new Error("Database query error: " + error.message);
  }
}

const findOne = async ({params, requestId, transaction=null}) => {
    try {
        const options = {
            where: params,
        };

        if (transaction){
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE
        }

        return await Borrow.findOne(options)
    }catch (error) {
        console.error(`Request ID: ${requestId} - FindOne Book Repository error:`, error.message);
        throw new Error("Database query error: " + error.message);
    }
}

const update = async ({params, id, requestId, transaction=null})=>{
    try {
        const options ={where:{id:id}}
        if (transaction){
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE
        }
        const update = await Borrow.update(params, options)
        return update
    } catch (error) {
        console.error(`Request ID: ${requestId} - Update Borrow Repository error:`, error.message);
        throw new Error("Database query error: " + error.message);
    }
}
module.exports={
    insert,findOne,update
}
