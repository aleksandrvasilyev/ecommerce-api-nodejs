"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(Order, { foreignKey: "order_id" });
      this.belongsTo(Product, { foreignKey: "product_id" });
      this.belongsTo(ProductVariant, { foreignKey: "variant_id" });
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  OrderProduct.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Order id cannot be empty",
          },
        },
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
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "order_products",
      modelName: "OrderProduct",
    }
  );
  return OrderProduct;
};
