import { Router } from "express";
import {
  createOffer,
  listOffers,
  respondToOffer,
} from "../controllers/offers.js";

const router = Router();

router.post("/", createOffer);
router.get("/", listOffers);
router.patch("/:id/respond", respondToOffer);

export default router;
