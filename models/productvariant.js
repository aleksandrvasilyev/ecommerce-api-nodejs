"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Product }) {
      // define association here
      this.belongsTo(Product, { foreignKey: "product_id" });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  ProductVariant.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Product id cannot be empty",
          },
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Price cannot be empty",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "product_variants",
      modelName: "ProductVariant",
    }
  );
  return ProductVariant;
};
