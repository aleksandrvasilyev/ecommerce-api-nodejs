import db from "../models/index.js";
import { validate as isUuid } from "uuid";

const { Product } = db;

export const getAllProducts = async (req, res) => {
  const products = await Product.findAll();
  res.send(products);
};

export const getProduct = async (req, res) => {
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
};

export const createProduct = async (req, res) => {
  // get userAdmin
  const user = req.user;

  // get name, body, price
  const { name, body, price } = req.body;

  // add new product to the database
  const newProduct = await Product.create(req.body);

  // return success response with new product
  res.send(newProduct);
};

export const updateProduct = async (req, res) => {
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
};

export const deleteProduct = async (req, res) => {
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
};
