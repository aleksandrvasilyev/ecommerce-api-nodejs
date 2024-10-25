import db from "../service/db/config.js";
import pool from "../service/db/connection.js";

export const getAllCategories = async (req, res) => {
  try {
    const sql = `SELECT * FROM ${db.categoriesTable};`;
    const [result] = await pool.query(sql);
    res.send(result);
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).send({
      error: `An error occurred during getting all categories`,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `SELECT * FROM ${db.categoriesTable} WHERE id = ?;`;
    const [result] = await pool.query(sql, [id]);

    if (result.length === 0) {
      return res.status(404).send({ error: `Category not found` });
    }

    res.send(result);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).send({
      error: `An error occurred during getting category`,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    // get admin user
    // const user = req.user;

    // get category name
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ error: "Invalid category name!" });
    }

    // validate category name
    const isNameValid = name.length > 3;
    if (!isNameValid) {
      return res
        .status(400)
        .send({ error: "Name should be at least 3 symbols!" });
    }

    // check if category with the same name doesn't exist in db
    const [existingCategory] = await pool.query(
      `SELECT name FROM ${db.categoriesTable} WHERE name = ?;`,
      [name]
    );

    if (existingCategory.length !== 0) {
      return res
        .status(400)
        .send({ error: "Category with this name already exists!" });
    }

    // add new category to db
    const [category] = await pool.query(
      `INSERT INTO ${db.categoriesTable} (name) VALUES (?);`,
      [name]
    );

    // throw error if category was not inserted to database
    if (!category.insertId) {
      return res
        .status(400)
        .send({ error: "Error when inserting object to database" });
    }

    // get object from database
    const [createdCategory] = await pool.query(
      `SELECT * FROM ${db.categoriesTable} WHERE id = ?;`,
      [category.insertId]
    );

    // return success response with new category
    res.send(createdCategory[0]);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).send({
      error: `An error occurred during creating new category`,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    // get admin user
    // const user = req.user;

    // get category id
    const id = req.params.id;

    // check if category with this id exist
    const [existingCategory] = await pool.query(
      `SELECT * FROM ${db.categoriesTable} WHERE id = ?;`,
      [id]
    );

    if (existingCategory.length === 0) {
      return res
        .status(400)
        .send({ error: "Category with this id does not exist!" });
    }

    // check if name exists in request body
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ error: "Name is required!" });
    }

    // validate category name
    const isNameValid = name.length > 3;
    if (!isNameValid) {
      return res
        .status(400)
        .send({ error: "Name should be at least 3 symbols!" });
    }

    // update category
    await pool.query(
      `UPDATE ${db.categoriesTable} SET name = ? WHERE id = ?;`,
      [name, id]
    );

    // get updated category
    const [updatedCategory] = await pool.query(
      `SELECT * FROM ${db.categoriesTable} WHERE id = ?;`,
      [id]
    );

    res.send(updatedCategory[0]);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).send({
      error: `An error occurred during updating category`,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    // get category id
    const id = req.params.id;

    // check if category with this id exists
    const [existingCategory] = await pool.query(
      `SELECT * FROM ${db.categoriesTable} WHERE id = ?;`,
      [id]
    );

    if (existingCategory.length === 0) {
      return res
        .status(400)
        .send({ error: "Category with this id does not exist!" });
    }

    // delete category from db
    await pool.query(`DELETE FROM ${db.categoriesTable} WHERE id = ?;`, [id]);

    // send success response
    res.send({ message: "Category deleted successfully!" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).send({
      error: `An error occurred during deleting the category`,
    });
  }
};
