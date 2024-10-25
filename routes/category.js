import express from "express";
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import isAdmin from "../middlewares/isAdmin.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.post("/", isAdmin, createCategory);
categoryRouter.put("/:id", isAdmin, updateCategory);
categoryRouter.delete("/:id", isAdmin, deleteCategory);

export default categoryRouter;
