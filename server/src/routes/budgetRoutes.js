import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getBudgets, setBudget, deleteBudget } from "../controllers/budgetController.js";

const router = Router();

router.use(requireAuth);
router.get("/", getBudgets);
router.post("/", setBudget);
router.delete("/:id", deleteBudget);

export default router;