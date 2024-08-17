'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Borrow, {
        foreignKey: 'user_id'
      })
    }
  }
  User.init({
    id: {type:DataTypes.INTEGER, autoIncrement:true},
    code: {type:DataTypes.STRING, primaryKey: true},
    name: DataTypes.STRING,
    quota: DataTypes.INTEGER,
    penalty_date: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: {type:DataTypes.DATE, allowNull: true},
  }, {
    sequelize,
    modelName: 'users',
    timestamps: true,
  });
  return User;
};