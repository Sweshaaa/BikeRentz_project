import { Router } from "express";
import { listBikes, getBike } from "../controllers/bike.controller";

const router = Router();

router.get("/", listBikes);
router.get("/:id", getBike);

export default router;
