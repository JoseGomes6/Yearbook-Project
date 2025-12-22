import express from "express";
import {
  updateProfile,
  getProfile,
  getYearbook,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/yearbook/profiles", getYearbook);
router.get("/:userId", getProfile);
router.put("/:userId", updateProfile);

export default router;
