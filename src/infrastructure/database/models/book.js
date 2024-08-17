'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Book.hasMany(models.Borrow, {
        foreignKey: 'book_id'
      })
    }
  }
  Book.init({
    id: {type:DataTypes.INTEGER, autoIncrement:true},
    code: {type:DataTypes.STRING, primaryKey: true},
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: {type:DataTypes.DATE, allowNull: true},
  }, {
    sequelize,
    modelName: 'books',
    timestamps: true,
  });
  return Book;
};