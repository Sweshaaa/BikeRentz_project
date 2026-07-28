import { Router } from "express";
import { listAllRentals, updateRentalStatus } from "../../controllers/admin/rental.controller";
import { protect } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/admin";

const router = Router();

router.use(protect, requireAdmin);

router.get("/", listAllRentals);
router.patch("/:id/status", updateRentalStatus);

export default router;
