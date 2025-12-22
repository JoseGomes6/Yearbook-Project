import express from "express";
import {
  sendRequest,
  acceptRequest,
  removeFriend,
  getRequests,
  declineRequest,
  pendingRequests,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/request/:targetId", sendRequest);
router.post("/requests/:userId", pendingRequests);
router.post("/accept", acceptRequest);
router.post("/remove", removeFriend);
router.get("/list/:userId", getRequests);
router.get("/decline", declineRequest);

export default router;
