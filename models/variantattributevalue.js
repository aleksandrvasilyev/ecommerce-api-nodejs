"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class VariantAttributeValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(ProductVariant, { foreignKey: "variant_id" });
      this.belongsTo(AttributeValue, { foreignKey: "attribute_value_id" });
    }
  }
  VariantAttributeValue.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Variant id cannot be empty",
          },
        },
      },
      attribute_value_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Attribute value id cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "variant_attribute_values",
      modelName: "VariantAttributeValue",
    }
  );
  return VariantAttributeValue;
};
