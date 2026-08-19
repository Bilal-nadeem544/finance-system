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
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Category name and type are required" });
    }

    const existing = await prisma.category.findFirst({ where: { name, type } });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await prisma.category.create({ data: { name, type } });
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