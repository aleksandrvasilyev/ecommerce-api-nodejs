import pool from "../service/db/connection.js";
import db from "../service/db/config.js";

export const getAllPages = async (req, res) => {
  try {
    // get all pages
    const sql = `SELECT * FROM ${db.pagesTable};`;
    const [result] = await pool.query(sql);
    res.send(result);
  } catch (error) {
    console.error("Get all pages error:", error);
    res.status(500).send({
      error: `An error occurred during getting all pages`,
    });
  }
};

export const getPage = async (req, res) => {
  try {
    // get id
    const id = req.params.id;

    // find page by id
    const sql = `SELECT * FROM ${db.pagesTable} WHERE id = ?;`;
    const [result] = await pool.query(sql, [id]);

    // throw error if page does not exist
    if (result.length === 0) {
      return res.status(404).send({ error: `Page not found` });
    }

    // send success result
    res.send(result);
  } catch (error) {
    console.error("Get page error:", error);
    res.status(500).send({
      error: `An error occurred during getting the page`,
    });
  }
};

export const createPage = async (req, res) => {
  try {
    // get userAdmin
    const user = req.user;

    // get name, description
    const { name, description } = req.body;

    // check if name, description not null
    if (!name || !description) {
      return res.status(400).send({ error: "Name, description are required!" });
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

    // add new page to the database
    const [page] = await pool.query(
      `INSERT INTO ${db.pagesTable} (name, description) VALUES (?, ?);`,
      [name, description]
    );

    // throw error if page was not inserted to database
    if (!page.insertId) {
      return res
        .status(400)
        .send({ error: "Error when inserting page to database" });
    }

    // get page from database
    const [createdPage] = await pool.query(
      `SELECT * FROM ${db.pagesTable} WHERE id = ?;`,
      [page.insertId]
    );

    // return success response with new page
    res.send(createdPage[0]);
  } catch (error) {
    console.error("Create page error:", error);
    res.status(500).send({
      error: `An error occurred during creating the page`,
    });
  }
};

export const updatePage = async (req, res) => {
  try {
    // get page id
    const id = req.params.id;

    // throw error if page with this id does not exist
    const [existingPage] = await pool.query(
      `SELECT * FROM ${db.pagesTable} WHERE id = ?;`,
      [id]
    );

    if (existingPage.length === 0) {
      return res
        .status(400)
        .send({ error: "Page with this id does not exist!" });
    }

    // check if name, description exist in request body
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).send({ error: "Name, description are required!" });
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

    // update page
    const [page] = await pool.query(
      `UPDATE ${db.pagesTable} 
        SET name = ?, description = ?
        WHERE id = ?;`,
      [name, description, id]
    );

    // throw error if page was not updated in database
    if (page.warningStatus !== 0) {
      return res
        .status(400)
        .send({ error: "Error when updating page in database" });
    }

    // get updated page
    const [updatedPage] = await pool.query(
      `SELECT * FROM ${db.pagesTable} WHERE id = ?;`,
      [id]
    );

    // send success response with updated page
    res.send(updatedPage[0]);
  } catch (error) {
    console.error("Update page error:", error);
    res.status(500).send({
      error: `An error occurred during updating the page`,
    });
  }
};

export const deletePage = async (req, res) => {
  try {
    // get page id
    const id = req.params.id;

    // check if page with this id exists
    const [existingPage] = await pool.query(
      `SELECT * FROM ${db.pagesTable} WHERE id = ?;`,
      [id]
    );

    if (existingPage.length === 0) {
      return res
        .status(400)
        .send({ error: "Page with this id does not exist!" });
    }

    // delete page form db
    const [deletePage] = await pool.query(
      `DELETE FROM ${db.pagesTable} WHERE id = ?;`,
      [id]
    );

    // send success response
    res.send({ message: "Page deleted successfully!" });
  } catch (error) {
    console.error("Delete page error:", error);
    res.status(500).send({
      error: `An error occurred during deleting the page`,
    });
  }
};
