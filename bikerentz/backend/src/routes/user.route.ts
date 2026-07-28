import { Router } from "express";
import { getMe, updateMe } from "../controllers/user.controller";
import { protect } from "../middleware/auth";
import { uploadAvatar } from "../middleware/uploads";

const router = Router();

router.get("/me", protect, getMe);
router.put("/me", protect, uploadAvatar.single("avatar"), updateMe);

export default router;
