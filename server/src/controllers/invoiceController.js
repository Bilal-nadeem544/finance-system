import prisma from "../config/prisma.js";

export async function getInvoices(req, res, next) {
  try {
    const invoices = await prisma.invoice.findMany({ orderBy: { issueDate: "desc" } });
    res.json(invoices);
  } catch (err) {
    next(err);
  }
}

export async function createInvoice(req, res, next) {
  try {
    const { client, issueDate, dueDate, amount } = req.body;
    if (!client || !dueDate || !amount) {
      return res.status(400).json({ message: "Client, dueDate, and amount are required" });
    }

    const count = await prisma.invoice.count();
    const invoiceNo = `INV-${1042 + count + 1}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        client,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: new Date(dueDate),
        amount: Number(amount),
        status: "Pending",
      },
    });

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function updateInvoiceStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Overdue", "Paid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    });

    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function deleteInvoice(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.invoice.delete({ where: { id } });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    next(err);
  }
}