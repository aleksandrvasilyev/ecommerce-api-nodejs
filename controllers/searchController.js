import { validate as isUuid } from "uuid";

import db from "../models/index.js";
const { Product, Sequelize } = db;
const { Op } = Sequelize;

export const search = async (req, res) => {
  // get and check query form request
  const query = req.query.q;

  // if not query -> return an error
  if (!query) {
    return res.status(404).send({ error: "Empty query!" });
  }

  // find results
  const search = await Product.findAll({
    where: {
      name: {
        [Op.like]: `%${query}%`,
      },
    },
  });

  // check if results not found
  if (search.length === 0) {
    return res.status(404).send({ error: "No results found!" });
  }

  // send success response with list of results
  res.send(search);
};
