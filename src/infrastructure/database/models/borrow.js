'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Borrow.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      models.Borrow.belongsTo(models.Book, {
        foreignKey: "book_id",
      });
    }
  }
  Borrow.init({
    id: {type:DataTypes.INTEGER, autoIncrement:true, primaryKey: true},
    book_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    checkout_at: DataTypes.DATE,
    due_date: DataTypes.DATE,
    return_date: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {type:DataTypes.DATE, allowNull: true},
  }, {
    sequelize,
    modelName: 'Borrow',
    tableName: 'borrow',
    timestamps: true,
  });
  return Borrow;
};