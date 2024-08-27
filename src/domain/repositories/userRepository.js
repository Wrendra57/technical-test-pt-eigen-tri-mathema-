const {
  sequelize,

} = require("../../infrastructure/database/models/index.js");

const models = require('../../infrastructure/database/models/index.js');
const User = models.User

const findAll = async ({limit, offset,requestId}) => {
  try {
    let users;
    users = await sequelize.query(`SELECT u.code AS user_code,
                                           u.name,
                                           u.quota,
                                           u.penalty_date,
                                           COALESCE(
                                                           json_agg(
                                                           json_build_object(
                                                                   'borrow_id', br.id,
                                                                   'book_code', br.book_id,
                                                                   'checkout_at', br.checkout_at,
                                                                   'due_date', br.due_date,
                                                                   'return_date', br.return_date,
                                                                   'book_title', b.title,
                                                                   'author', b.author
                                                           )
                                                                   ) FILTER (WHERE br.id IS NOT NULL),
                                                           '[]'::json
                                           )      AS book_borrowed,
                                           u.created_at
                                    FROM "user" u
                                             LEFT JOIN borrow br ON br.user_id = u.code
                                             LEFT JOIN book b ON b.code = br.book_id
                                    WHERE u.deleted_at IS NULL
                                      AND br.deleted_at IS NULL
                                      AND br.return_date IS NULL
                                    GROUP BY u.code, u.name, u.quota, u.penalty_date, u.created_at
                                    ORDER BY u.code ASC
                                    LIMIT ${limit} OFFSET ${offset};`);
    const totalUser = await User.count({ where: {
        deleted_at: null
      } })
    return {users: users[0], totalUser: totalUser};
  } catch (error) {
    console.error(error)
    console.error(`Request ID: ${requestId} - User Repository error:`, error.message);
    throw new Error("Database query error: " + error.message);
  }
};

const insert = async ({params,requestId})=>{
  try{
      let user = await User.create(params);
      return user;
  } catch (error) {
    console.error(`Request ID: ${requestId} - User Repository Insert error:`, error.message);
    throw new Error("Database query error: " + error.message);
  }
}

const findOneUser = async ({code, requestId, transaction=null})=>{
  try {
    const options =  {
      where: {
        code:code
      }
    }
    if (transaction){
      options.transaction =transaction
      options.lock = transaction.LOCK.UPDATE
    }
    return await User.findOne(options)
  } catch (error) {
    console.error(`Request ID: ${requestId} - FindOne User Repository error:`, error.message);
    throw new Error("Database query error: " + error.message);
  }
}

const update = async ({params, code, requestId, transaction=null}) => {
  try{
    const options =  {
      where: {
        code:code
      }
    }
    if (transaction){
      options.transaction =transaction
      options.lock = transaction.LOCK.UPDATE
    }
    const update = await User.update(params, options);
    console.log(update)
    return update
  } catch (error) {
    console.error(`Request ID: ${requestId} - Update User Repository error:`, error.message);
    throw new Error("Database query error: " + error.message);
  }
}
module.exports = {
  findAll,
  insert,
  findOneUser,
  update
};
