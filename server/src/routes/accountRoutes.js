import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getAccounts, createAccount, updateAccount, deleteAccount } from "../controllers/accountController.js";

const router = Router();

router.use(requireAuth);
router.get("/", getAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

export default router;