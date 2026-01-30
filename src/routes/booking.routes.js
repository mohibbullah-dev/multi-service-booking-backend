import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  cancelBooking,
  createBooking,
  myBookings,
} from "../controllers/booking.controller.js";

const router = Router();

router.post("/", requireAuth, createBooking);
router.get("/my", requireAuth, myBookings);
router.patch("/:id/cancel", requireAuth, cancelBooking);

export default router;
