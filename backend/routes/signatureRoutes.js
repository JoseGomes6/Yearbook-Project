import express from "express";
import {
  addSignature,
  getSignatures,
} from "../controllers/signatureController.js";

const router = express.Router();

// Adicionar mensagem: POST /api/signatures/:targetId
router.post("/:targetId", addSignature);

// Ler mural: GET /api/signatures/:userId
router.get("/:userId", getSignatures);

export default router;
