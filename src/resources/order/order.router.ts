import { Router } from "express";
import { createOne, getAll } from "./order.controller";

const router = Router();

router.get("/", getAll);
router.post("/", createOne);

export default router;
