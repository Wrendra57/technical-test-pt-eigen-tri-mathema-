# Book Borrow App

This project is a technical test for a company. So this is a small project. It is a web application that allows users to borrow books. The application is built using JavaScript, Node.js, and PostgreSQL, and it uses Sequelize as the ORM. Docker and Docker Compose are used to manage the services.

## Features

- **User Management**: Users can register and log in to the application.
- **Book Management**: Users can add, update, and delete books.
- **Borrowing System**: Users can borrow and return books.
- **Database Integration**: Uses PostgreSQL for data storage.
- **Environment Configuration**: Configurable for development, testing, and production environments.

## Technologies Used

- **JavaScript**
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Sequelize**
- **Docker**

## Prerequisites

- Node.js
- npm

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
NODE_ENV=development
PORT=8080
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=book_borrow_app
```

## How To Start
- Clone this project
    ``` 
    git clone https://github.com/Wrendra57/technical-test-pt-eigen-tri-mathema-
    cd technical-test-pt-eigen-tri-mathema-
    ```
- Install module package.json
    ``` 
    npm install 
    ```
- Creating Database
    ``` 
    npm run db:create 
    ```
- MIgrate Database
    ```
    npm run db:migrate
    ```
- Migrate data seeder
    ```
    npm run db:seed:all
    ```
- Start program
    ```
    npm run start
    ```

