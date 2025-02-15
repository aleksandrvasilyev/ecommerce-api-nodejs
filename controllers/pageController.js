import db from "../models/index.js";
import { validate as isUuid } from "uuid";

const { Page } = db;

export const getAllPages = async (req, res) => {
  const orderBy = req.query.orderby || "updatedAt";
  const order = req.query.order || "DESC";

  const pages = await Page.findAll({
    limit: 10,
    order: [[orderBy, order]],
  });

  res.send(pages);
};

export const getPage = async (req, res) => {
  const uuid = req.params.uuid;

  if (!isUuid(uuid)) {
    return res.status(400).send({
      error: "Invalid UUID format",
    });
  }

  const page = await Page.findOne({
    where: { uuid },
  });

  if (!page) {
    return res.status(404).send({ error: "Page not found!" });
  }

  res.send(page);
};

export const createPage = async (req, res) => {
  // get name, body
  const { name, body } = req.body;

  // check if name, body not null
  if (!name || !body) {
    return res.status(400).send({ error: "Name and body are required!" });
  }

  // validate name
  const isNameValid = name.length > 3;
  if (!isNameValid) {
    return res
      .status(400)
      .send({ error: "Name should be at least 3 characters long!" });
  }

  // validate body
  const isBodyValid = body.length > 5;
  if (!isBodyValid) {
    return res
      .status(400)
      .send({ error: "Body should be at least 5 characters long!" });
  }

  const newPage = await Page.create({ name, body });

  // return success response with new page
  res.send(newPage);
};

export const updatePage = async (req, res) => {
  const uuid = req.params.uuid;

  if (!isUuid(uuid)) {
    return res.status(400).send({
      error: "Invalid UUID format",
    });
  }

  // check if name exists in request body
  const { name, body } = req.body;

  if (!name || !body) {
    return res.status(400).send({ error: "Name and body are required!" });
  }

  // validate page name
  const isNameValid = name.length > 3;
  if (!isNameValid) {
    return res
      .status(400)
      .send({ error: "Name should be at least 3 symbols!" });
  }

  const [updated] = await Page.update({ name, body }, { where: { uuid } });

  if (!updated) {
    return res.status(404).send({ error: "Page not found!" });
  }

  const updatedPage = await Page.findOne({ where: { uuid } });
  return res.send(updatedPage);
};

export const deletePage = async (req, res) => {
  const uuid = req.params.uuid;

  if (!isUuid(uuid)) {
    return res.status(400).send({
      error: "Invalid UUID format",
    });
  }

  const deleted = await Page.destroy({
    where: { uuid },
  });

  if (!deleted) {
    return res.status(404).send({ error: "Page not found!" });
  }

  return res.send({ message: "Page deleted successfully" });
};
