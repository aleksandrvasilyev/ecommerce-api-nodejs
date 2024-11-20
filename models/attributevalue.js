"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class AttributeValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Attribute }) {
      // define association here
      this.belongsTo(Attribute, { foreignKey: "attribute_id" });
    }
  }
  AttributeValue.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      attribute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Attribute id cannot be empty",
          },
        },
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Value cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "attribute_values",
      modelName: "AttributeValue",
    }
  );
  return AttributeValue;
};
