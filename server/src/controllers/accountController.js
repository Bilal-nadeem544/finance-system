import prisma from "../config/prisma.js";

export async function getAccounts(req, res, next) {
  try {
    const accounts = await prisma.account.findMany({ orderBy: { createdAt: "asc" } });
    res.json(accounts);
  } catch (err) {
    next(err);
  }
}

export async function createAccount(req, res, next) {
  try {
    const { name, type, bank, balance } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const account = await prisma.account.create({
      data: { name, type, bank, balance: Number(balance) || 0 },
    });
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
}

export async function updateAccount(req, res, next) {
  try {
    const { id } = req.params;
    const { name, type, bank, balance } = req.body;

    const account = await prisma.account.update({
      where: { id },
      data: { name, type, bank, balance: balance !== undefined ? Number(balance) : undefined },
    });
    res.json(account);
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.account.delete({ where: { id } });
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
}