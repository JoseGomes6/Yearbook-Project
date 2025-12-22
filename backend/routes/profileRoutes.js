import express from "express";
import {
  updateProfile,
  getProfile,
  getYearbook,
} from "../controllers/profileController.js";

const router = express.Router();

// Nota: No server.js este prefixo será /api/profile
router.get("/yearbook/profiles", getYearbook);
router.get("/:userId", getProfile);
router.put("/:userId", updateProfile);

export default router;
