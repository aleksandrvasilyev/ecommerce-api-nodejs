import db from "../models/index.js";
import { validate as isUuid } from "uuid";

const { Product } = db;

export const getAllProducts = async (req, res) => {
  try {
    // get all products
    const products = await Product.findAll();
    res.send(products);
  } catch (error) {
    console.error("Get all products error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during getting all products`,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    // get id
    const uuid = req.params.uuid;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    // find product by id
    const product = await Product.findOne({
      where: { uuid },
    });

    if (!product) {
      return res.status(404).send({ error: "Product not found!" });
    }

    // send success result
    res.send(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).send({
      error: `An error occurred during getting the product`,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    // get userAdmin
    const user = req.user;

    // get name, body, price
    const { name, body, price } = req.body;

    // add new product to the database
    const newProduct = await Product.create(req.body);

    // return success response with new product
    res.send(newProduct);
  } catch (error) {
    console.error("Create product error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during creating the product`,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // get product id
    const uuid = req.params.uuid;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ error: "Name is required!" });
    }
    
    // update product
    const [updated] = await Product.update(req.body, { where: { uuid } });

    if (!updated) {
      return res.status(404).send({ error: "Product not found!" });
    }

    const updatedProduct = await Product.findOne({ where: { uuid } });
    return res.send(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during updating the product`,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // get product id
    const uuid = req.params.uuid;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    const deleted = await Product.destroy({
      where: { uuid },
    });

    if (!deleted) {
      return res.status(404).send({ error: "Product not found!" });
    }

    return res.send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during deleting the product`,
    });
  }
};
