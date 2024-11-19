"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id" });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Order.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "User_id cannot be empty",
          },
        },
        references: {
          model: "users",
          key: "id",
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Address cannot be empty",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Status cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "orders",
      modelName: "Order",
    }
  );
  return Order;
};
