import { Router } from "express";
import { getDashboardStats } from "../../controllers/admin/dashboard.controller";
import { protect } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/admin";

const router = Router();

router.use(protect, requireAdmin);
router.get("/stats", getDashboardStats);

export default router;
