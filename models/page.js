"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Page.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: "Name cannot be empty",
          },
        },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: "Body cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "pages",
      modelName: "Page",
    }
  );
  return Page;
};
