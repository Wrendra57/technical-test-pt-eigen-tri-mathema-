'use strict';
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Borrow, {
        foreignKey: 'user_id'
      })
    }
  }
  User.init({
    id: {type:DataTypes.INTEGER, autoIncrement:true},
    code: {type:DataTypes.STRING, primaryKey: true, allowNull: true ,defaultValue:sequelize.literal('generate_user_code()')},
    name: DataTypes.STRING,
    quota: DataTypes.INTEGER,
    penalty_date: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: {type:DataTypes.DATE, allowNull: true},
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return User;
};