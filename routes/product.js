import express from "express";
import isAdmin from "../middlewares/isAdmin.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController.js";
import { search } from "../controllers/searchController.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/search", search);
productRouter.get("/:id", getProduct);
productRouter.post("/", isAdmin, createProduct);
productRouter.put("/:id", isAdmin, updateProduct);
productRouter.delete("/:id", isAdmin, deleteProduct);

export default productRouter;
