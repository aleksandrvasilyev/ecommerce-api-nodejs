import db from "../models/index.js";
import { validate as isUuid } from "uuid";

const { Category } = db;

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.send(categories);
  } catch (error) {
    console.error("Get all categories error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during getting all categories`,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const uuid = req.params.uuid;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    const category = await Category.findOne({
      where: { uuid },
    });

    if (!category) {
      return res.status(404).send({ error: "Category not found!" });
    }

    res.send(category);
  } catch (error) {
    console.error("Get category error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

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

    //  validate category name
    const isNameValid = name.length > 3;
    if (!isNameValid) {
      return res
        .status(400)
        .send({ error: "Name should be at least 3 symbols!" });
    }

    // create new category
    const newCategory = await Category.create({ name });

    // return success response with new category
    res.send(newCategory);
  } catch (error) {
    console.error("Create category error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during creating new category`,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    // get category id
    const uuid = req.params.uuid;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
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
    const [updated] = await Category.update({ name }, { where: { uuid } });

    if (!updated) {
      return res.status(404).send({ error: "Category not found!" });
    }

    const updatedCategory = await Category.findOne({ where: { uuid } });
    return res.send(updatedCategory);
  } catch (error) {
    console.error("Update category error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during updating category`,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const uuid = req.params.uuid;

    if (!isUuid(uuid)) {
      return res.status(400).send({
        error: "Invalid UUID format",
      });
    }

    const deleted = await Category.destroy({
      where: { uuid },
    });

    if (!deleted) {
      return res.status(404).send({ error: "Category not found!" });
    }

    return res.send({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);

    if (error.errors && error.errors[0]) {
      return res.status(400).send({
        error: error.errors[0].message,
      });
    }

    res.status(500).send({
      error: `An error occurred during deleting the category`,
    });
  }
};
