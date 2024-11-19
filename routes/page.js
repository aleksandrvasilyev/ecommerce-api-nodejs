import express from "express";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createPage,
  deletePage,
  getAllPages,
  getPage,
  updatePage,
} from "../controllers/pageController.js";

const pageRouter = express.Router();

pageRouter.get("/", getAllPages);
pageRouter.get("/:uuid", getPage);
pageRouter.post("/", isAdmin, createPage);
pageRouter.put("/:uuid", isAdmin, updatePage);
pageRouter.delete("/:uuid", isAdmin, deletePage);

export default pageRouter;
