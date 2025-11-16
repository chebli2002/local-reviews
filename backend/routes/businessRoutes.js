// backend/routes/businessRoutes.js
import express from "express";
import {
  getAllBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "../controllers/businessController.js";

import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllBusinesses);
router.get("/:id", getBusinessById);

// PROTECTED
router.post("/", authRequired, createBusiness);
router.put("/:id", authRequired, updateBusiness);
router.delete("/:id", authRequired, deleteBusiness);

export default router;
