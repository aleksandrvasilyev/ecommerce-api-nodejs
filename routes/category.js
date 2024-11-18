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
categoryRouter.get("/:uuid", getCategory);
categoryRouter.post("/", isAdmin, createCategory);
categoryRouter.put("/:uuid", isAdmin, updateCategory);
categoryRouter.delete("/:uuid", isAdmin, deleteCategory);

export default categoryRouter;
