import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import { seedInitialProducts } from "./services/productService";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);

// seed the products to database
seedInitialProducts();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
