import { Router } from "express";
import { create, getAll, getById } from "./product.controller";

const router = Router();

router.post("/", create);
router.delete("/");
router.get("/", getAll);
router.get("/:id", getById);

export default router;
