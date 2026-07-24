import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoryController.js";

const router = Router();

router.use(requireAuth);
router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

export default router;