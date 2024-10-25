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
pageRouter.get("/:id", getPage);
pageRouter.post("/", isAdmin, createPage);
pageRouter.put("/:id", isAdmin, updatePage);
pageRouter.delete("/:id", isAdmin, deletePage);

export default pageRouter;
