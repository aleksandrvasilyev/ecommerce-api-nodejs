import express from "express";
import categoryRouter from "./routes/category.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import pageRouter from "./routes/page.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";

const app = express();

app.use(express.json());

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/pages", pageRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/", authRouter);

app.use((req, res) => {
  res.status(404).send("404");
});

export default app;
