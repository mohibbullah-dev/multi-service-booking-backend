import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = Router();

// public
router.get("/", listServices);

// protected
router.post("/", requireAuth, createService);
router.put("/:id", requireAuth, updateService);
router.delete("/:id", requireAuth, deleteService);

export default router;
