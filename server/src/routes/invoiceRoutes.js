import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getInvoices, createInvoice, updateInvoiceStatus, deleteInvoice } from "../controllers/invoiceController.js";

const router = Router();

router.use(requireAuth);
router.get("/", getInvoices);
router.post("/", createInvoice);
router.patch("/:id/status", updateInvoiceStatus);
router.delete("/:id", deleteInvoice);

export default router;