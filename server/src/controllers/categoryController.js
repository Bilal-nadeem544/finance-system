import prisma from "../config/prisma.js";

export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { createdAt: "asc" } });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
}