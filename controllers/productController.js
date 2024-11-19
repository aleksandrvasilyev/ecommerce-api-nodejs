import pool from "../service/db/connection.js";
import db from "../service/db/config.js";
import db1 from "../models/index.js";
import { validate as isUuid } from "uuid";

const { Product } = db1;
export const getAllProducts = async (req, res) => {
  try {
    // get all products
    const sql = `SELECT * FROM ${db.productsTable};`;
    const [result] = await pool.query(sql);
    res.send(result);
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).send({
      error: `An error occurred during getting all products`,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    // get id
    const id = req.params.id;

    // find product by id
    const sql = `SELECT * FROM ${db.productsTable} WHERE id = ?;`;
    const [result] = await pool.query(sql, [id]);

    // throw error if product does not exist
    if (result.length === 0) {
      return res.status(404).send({ error: `Product not found` });
    }

    // send success result
    res.send(result);
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

    // get name, description, price
    const { name, description, price } = req.body;

    // check if name, description and price not null
    if (!name || !description || !price) {
      return res
        .status(400)
        .send({ error: "Name, description and price are required!" });
    }

    // validate name
    const isNameValid = name.length > 3;
    if (!isNameValid) {
      return res
        .status(400)
        .send({ error: "Name should be at least 3 characters long!" });
    }

    // validate description
    const isDescriptionValid = name.length > 5;
    if (!isDescriptionValid) {
      return res
        .status(400)
        .send({ error: "Description should be at least 5 characters long!" });
    }

    // validate price
    const isPriceValid = typeof price === "number" && price > 0;
    if (!isPriceValid) {
      return res
        .status(400)
        .send({ error: "Price should be positive number!" });
    }

    // add new product to the database
    const [product] = await pool.query(
      `INSERT INTO ${db.productsTable} (name, description, price) VALUES (?, ?, ?);`,
      [name, description, price]
    );

    // throw error if product was not inserted to database
    if (!product.insertId) {
      return res
        .status(400)
        .send({ error: "Error when inserting object to database" });
    }

    // get object from database
    const [createdProduct] = await pool.query(
      `SELECT * FROM ${db.productsTable} WHERE id = ?;`,
      [product.insertId]
    );

    // return success response with new product
    res.send(createdProduct[0]);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).send({
      error: `An error occurred during creating the product`,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // get product id
    const id = req.params.id;

    // throw error if product with this id does not exist
    const [existingProduct] = await pool.query(
      `SELECT * FROM ${db.productsTable} WHERE id = ?;`,
      [id]
    );

    if (existingProduct.length === 0) {
      return res
        .status(400)
        .send({ error: "Product with this id does not exist!" });
    }

    // check if name, description, price exist in request body
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res
        .status(400)
        .send({ error: "Name, description, price are required!" });
    }

    // validate name
    const isNameValid = name.length > 3;
    if (!isNameValid) {
      return res
        .status(400)
        .send({ error: "Name should be at least 3 characters long!" });
    }

    // validate description
    const isDescriptionValid = name.length > 5;
    if (!isDescriptionValid) {
      return res
        .status(400)
        .send({ error: "Description should be at least 5 characters long!" });
    }

    // validate price
    const isPriceValid = typeof price === "number" && price > 0;
    if (!isPriceValid) {
      return res
        .status(400)
        .send({ error: "Price should be positive number!" });
    }

    // update product
    const [product] = await pool.query(
      `UPDATE ${db.productsTable} 
        SET name = ?, description = ?, price = ?
        WHERE id = ?;`,
      [name, description, price, id]
    );

    // throw error if product was not updated in database
    if (product.warningStatus !== 0) {
      return res
        .status(400)
        .send({ error: "Error when updating product in database" });
    }

    // get updated product
    const [updatedProduct] = await pool.query(
      `SELECT * FROM ${db.productsTable} WHERE id = ?;`,
      [id]
    );

    // send success response with updated product
    res.send(updatedProduct[0]);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).send({
      error: `An error occurred during updating the product`,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // get product id
    const id = req.params.id;

    // check if product with this id exists
    const [existingProduct] = await pool.query(
      `SELECT * FROM ${db.productsTable} WHERE id = ?;`,
      [id]
    );

    if (existingProduct.length === 0) {
      return res
        .status(400)
        .send({ error: "Product with this id does not exist!" });
    }

    // delete product form db
    const [deleteProduct] = await pool.query(
      `DELETE FROM ${db.productsTable} WHERE id = ?;`,
      [id]
    );

    // send success response
    res.send({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).send({
      error: `An error occurred during deleting the product`,
    });
  }
};
