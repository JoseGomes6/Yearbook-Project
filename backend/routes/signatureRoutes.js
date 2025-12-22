import express from "express";
import {
  addSignature,
  getSignatures,
} from "../controllers/signatureController.js";

const router = express.Router();

router.post("/:targetId", addSignature);
router.get("/:userId", getSignatures);

export default router;
