import { Router } from "express";
import { createCartItem, deleteCartItem, get } from "./cart.controller";

const router = Router();

router.get("/", get);
router.post("/add-item", createCartItem);
router.delete("/remove-item", deleteCartItem);

export default router;
