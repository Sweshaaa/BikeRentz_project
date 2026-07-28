import { Router } from "express";
import { listUsers, getUser, updateUser, deleteUser, updateUserRole } from "../../controllers/admin/user.controller";
import { protect } from "../../middleware/auth";
import { requireAdmin } from "../../middleware/admin";

const router = Router();

router.use(protect, requireAdmin);

router.get("/", listUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.patch("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;
