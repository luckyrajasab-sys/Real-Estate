import { Router } from "express";
import {
  createEnquiry,
  listEnquiries,
  updateEnquiryStatus,
  replyToEnquiry,
} from "../controllers/enquiries.js";

const router = Router();

router.post("/", createEnquiry);
router.get("/", listEnquiries);
router.patch("/:id/status", updateEnquiryStatus);
router.post("/:id/reply", replyToEnquiry);

export default router;
