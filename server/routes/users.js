import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserListings,
  socialAuth,
} from "../controllers/users.js";

const router = Router();

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.get("/listings", getUserListings);
router.post("/social", socialAuth);

export default router;

