import { Router } from "express";
import { getAll, getById } from "./user.controller";

const router = Router();

router.get("/", getAll);
router.get("/me", getById);

export default router;
