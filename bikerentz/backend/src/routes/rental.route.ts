import { Router } from "express";
import { createRental, verifyRentalPayment, myRentals } from "../controllers/rental.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/", protect, createRental);
router.get("/verify", protect, verifyRentalPayment);
router.get("/mine", protect, myRentals);

export default router;
