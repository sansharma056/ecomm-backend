import { Router } from "express";
import { app } from "../../server";
import { getById } from "../user/user.controller";
import { create, get } from "./review.controller";

const router = Router();

router.get("/", get);
router.get("/:id", getById);
router.post("/", create);

export default router;
