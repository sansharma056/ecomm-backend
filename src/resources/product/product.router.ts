import { Router } from "express";
import { create, deleteById, getAll, getById } from "./product.controller";

const router = Router();

router.post("/", create);
router.delete("/", deleteById);
router.get("/", getAll);
router.get("/:id", getById);

export default router;
