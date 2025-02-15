import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRouter from "./routes/category.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import pageRouter from "./routes/page.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import attributeRouter from "./routes/attribute.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// sequelize
import db from "./models/index.js";

(async () => {
  // await db.sequelize.sync({ force: true }); // delete all rows and create db from scratch
  // await db.sequelize.sync({ alter: true }); // update database schema
  await db.sequelize.authenticate();
  console.log("Database connected!");
})();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send({ message: "Hello world" });
});

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/pages", pageRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/attributes", attributeRouter);
app.use("/", authRouter);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send("404");
});

export default app;
