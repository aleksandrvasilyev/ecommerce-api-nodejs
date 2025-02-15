import db from "../../models/index.js";

const { Product } = db;

export const validateProducts = async (products) => {
  // throw error if no products
  if (!products || products.length === 0) {
    throw { status: 400, message: "Products are required!" };
  }

  // for loop
  for (const product of products) {
    // -- product id is a positive number
    if (typeof product.product_id !== "number" || product.product_id < 1) {
      throw { status: 400, message: "Product id must be a positive number!" };
    }
    // -- product quantity is a positive number
    if (typeof product.quantity !== "number" || product.product_id < 1) {
      throw {
        status: 400,
        message: "Product quantity must be a positive number!",
      };
    }

    // -- product exists in db
    const existingProduct = await Product.findOne({
      where: { id: product.product_id },
    });

    if (!existingProduct) {
      throw {
        status: 400,
        message: `Product with id ${product.product_id} not found!`,
      };
    }
  }
};

export const checkProductStock = () => {
  // TODO check if products in stock
};
