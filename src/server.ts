import express, { json, urlencoded } from "express";
import cors from "cors";
import { protect, signin, signup } from "./resources/utils/auth";
import userRouter from "./resources/user/user.router";
import reviewRouter from "./resources/review/review.router";
import vendorRouter from "./resources/vendor/vendor.router";
import categoryRouter from "./resources/category/category.router";
import productRouter from "./resources/product/product.router";
import cartRouter from "./resources/cart/cart.router";
import orderRouter from "./resources/order/order.router";

export const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/signin", signin);
app.post("/signup", signup);

app.use("/", protect);
app.use("/vendor", vendorRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/review", reviewRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

export const start = () => {
  const PORT = process.env.PORT ?? 3000;
  try {
    app.listen(PORT, () => {
      console.log(`API on localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};
