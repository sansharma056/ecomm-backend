import { Router } from "express";
import { getAll, getById, getMe } from "./user.controller";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/me, getMe");

export default router;
