import prisma from "../config/prisma.js";

export async function getTransactions(req, res, next) {
  try {
    const { type } = req.query;
    const transactions = await prisma.transaction.findMany({
      where: type ? { type } : undefined,
      include: { account: true },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

export async function createTransaction(req, res, next) {
  try {
    const { type, amount, date, category, description, accountId } = req.body;
    if (!type || !amount || !date || !category || !accountId) {
      return res.status(400).json({ message: "Type, amount, date, category, and accountId are required" });
    }

    const numericAmount = Number(amount);

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          type,
          amount: numericAmount,
          date: new Date(date),
          category,
          description,
          accountId,
        },
      });

      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            [type === "Income" ? "increment" : "decrement"]: numericAmount,
          },
        },
      });

      if (type === "Expense") {
        const budget = await tx.budget.findUnique({ where: { category } });
        if (budget) {
          await tx.budget.update({
            where: { category },
            data: { spent: { increment: numericAmount } },
          });
        }
      }

      return transaction;
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            [transaction.type === "Income" ? "decrement" : "increment"]: transaction.amount,
          },
        },
      });

      if (transaction.type === "Expense") {
        const budget = await tx.budget.findUnique({ where: { category: transaction.category } });
        if (budget) {
          await tx.budget.update({
            where: { category: transaction.category },
            data: { spent: { decrement: transaction.amount } },
          });
        }
      }

      await tx.transaction.delete({ where: { id } });
    });

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
}