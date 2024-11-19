import express from "express";
import categoryRouter from "./routes/category.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import pageRouter from "./routes/page.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";

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

app.use("/categories", categoryRouter); // seq + pg
app.use("/products", productRouter);
app.use("/pages", pageRouter); // seq + pg
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/", authRouter); // seq + pg

app.use((req, res) => {
  res.status(404).send("404");
});

export default app;
