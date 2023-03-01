'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'users',
      });
      Wallet.belongsTo(models.Currency, {
        foreignKey: 'id_currency',
        as: 'currency',
      });
    }
  }
  Wallet.init(
    {
      id_currency: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Wallet',
    }
  );
  return Wallet;
};
