import { Router } from "express";
import {
  listProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/properties.js";

const router = Router();

router.get("/featured", getFeaturedProperties);
router.get("/", listProperties);
router.get("/:id", getPropertyById);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;
