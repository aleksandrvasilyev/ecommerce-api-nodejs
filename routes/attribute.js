import express from "express";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createAttribute,
  deleteAttribute,
  getAllAttributes,
  getAttribute,
  updateAttribute,
} from "../controllers/attributeController.js";

const attributeRouter = express.Router();

attributeRouter.get("/", getAllAttributes);
attributeRouter.get("/:uuid", getAttribute);
attributeRouter.post("/", isAdmin, createAttribute);
attributeRouter.put("/:uuid", isAdmin, updateAttribute);
attributeRouter.delete("/:uuid", isAdmin, deleteAttribute);

export default attributeRouter;
