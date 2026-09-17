import { Router } from "express";
import {
  listSaved,
  toggleSaved,
  checkSaved,
} from "../controllers/saved.js";

const router = Router();

router.get("/", listSaved);
router.get("/:propertyId/check", checkSaved);
router.post("/:propertyId", toggleSaved);

export default router;
