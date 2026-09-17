import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserListings,
} from "../controllers/users.js";

const router = Router();

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.get("/listings", getUserListings);

export default router;
