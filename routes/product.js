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
productRouter.get("/:uuid", getProduct);
productRouter.post("/", isAdmin, createProduct);
productRouter.put("/:uuid", isAdmin, updateProduct);
productRouter.delete("/:uuid", isAdmin, deleteProduct);

export default productRouter;
