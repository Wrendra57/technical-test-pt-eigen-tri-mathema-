require('dotenv').config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST ,
  DB_NAME,
} = process.env;
console.log(DB_USERNAME);
module.exports = {
  "development": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": `${DB_NAME}_development`,
    "host": DB_HOST,
    "dialect": "postgres",
    "pool": {
      "max": 10,
      "min": 0,
      "acquire": 30000,
      "idle": 10000,
      "afterCreate": (connection, done) => {
        console.log('New connection created:', connection.processID);
        done(null, connection);
      },
      "beforeDestroy": (connection) => {
        console.log('Connection about to be destroyed:', connection.processID);
      }
    }
  },
  "test": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": `${DB_NAME}_test`,
    "host": DB_HOST,
    "dialect": "postgres",
    "pool": {
      "max": 10,
      "min": 0,
      "acquire": 30000,
      "idle": 10000,
      "afterCreate": (connection, done) => {
        console.log('New connection created:', connection.processID);
        done(null, connection);
      },
      "beforeDestroy": (connection) => {
        console.log('Connection about to be destroyed:', connection.processID);
      }
    }
  },
  "production": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": `${DB_NAME}_production`,
    "host": DB_HOST,
    "dialect": "postgres",
    "pool": {
      "max": 10,
      "min": 0,
      "acquire": 30000,
      "idle": 10000,
      "afterCreate": (connection, done) => {
        console.log('New connection created:', connection.processID);
        done(null, connection);
      },
      "beforeDestroy": (connection) => {
        console.log('Connection about to be destroyed:', connection.processID);
      }
    }
  }
}
