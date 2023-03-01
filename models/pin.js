'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pin.init(
    {
      id_verifikasi: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      email: DataTypes.STRING,
      pin: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Pin',
    }
  );
  return Pin;
};
