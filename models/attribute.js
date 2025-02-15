"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Attribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AttributeValue }) {
      // define association here
      this.hasMany(AttributeValue, {
        foreignKey: "attribute_id",
        as: "values",
      });
    }
  }
  Attribute.init(
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
      },
    },
    {
      sequelize,
      tableName: "attributes",
      modelName: "Attribute",
    }
  );
  return Attribute;
};
