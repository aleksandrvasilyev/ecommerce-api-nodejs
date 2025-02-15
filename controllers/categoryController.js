import db from "../models/index.js";
import { validate as isUuid } from "uuid";

const { Category } = db;

export const getAllCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.send(categories);
};

export const getCategory = async (req, res) => {
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
};

export const createCategory = async (req, res) => {
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
};

export const updateCategory = async (req, res) => {
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
};

export const deleteCategory = async (req, res) => {
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
};
