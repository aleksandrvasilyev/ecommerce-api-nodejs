import pool from "../service/db/connection.js";
import db from "../service/db/config.js";

export const search = async (req, res) => {
  // get and check query form request
  const query = req.query.q;

  // if not query -> return an error
  if (!query) {
    return res.status(404).send({ error: "Empty query!" });
  }

  // find results
  const [search] = await pool.query(
    `SELECT * FROM ${db.productsTable} WHERE name LIKE ?;`,
    [`%${query}%`]
  );

  // check if results not found
  if (search.length === 0) {
    return res.status(404).send({ error: "No results found!" });
  }

  // send success response with list of results
  res.send(search);
};
