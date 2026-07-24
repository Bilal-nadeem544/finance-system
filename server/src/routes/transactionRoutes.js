import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getTransactions, createTransaction, deleteTransaction } from "../controllers/transactionController.js";

const router = Router();

router.use(requireAuth);
router.get("/", getTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;