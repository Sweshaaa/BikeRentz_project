import { Router } from "express";
import { createBike, updateBike, deleteBike, setBikeStatus } from "../../controllers/admin/bike.controller";
import { protect } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/admin";
import { uploadBikeImage } from "../../middleware/uploads";

const router = Router();

router.use(protect, requireAdmin);

router.post("/", uploadBikeImage.single("image"), createBike);
router.put("/:id", uploadBikeImage.single("image"), updateBike);
router.delete("/:id", deleteBike);
router.patch("/:id/status", setBikeStatus);

export default router;
