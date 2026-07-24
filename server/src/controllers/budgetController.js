import prisma from "../config/prisma.js";

export async function getBudgets(req, res, next) {
  try {
    const budgets = await prisma.budget.findMany({ orderBy: { createdAt: "asc" } });
    res.json(budgets);
  } catch (err) {
    next(err);
  }
}

export async function setBudget(req, res, next) {
  try {
    const { category, budgeted } = req.body;
    if (!category || budgeted === undefined) {
      return res.status(400).json({ message: "Category and budgeted amount are required" });
    }

    const budget = await prisma.budget.upsert({
      where: { category },
      update: { budgeted: Number(budgeted) },
      create: { category, budgeted: Number(budgeted), spent: 0 },
    });

    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
}

export async function deleteBudget(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.budget.delete({ where: { id } });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
}