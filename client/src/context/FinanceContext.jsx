import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const FinanceContext = createContext(null);

const BRAND_NAME_KEY = "financeBrandName";
const BRAND_LOGO_KEY = "financeBrandLogo";
const DEFAULT_BRAND_NAME = "Finance System";

export function FinanceProvider({ children }) {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [brandName, setBrandName] = useState(() => localStorage.getItem(BRAND_NAME_KEY) || DEFAULT_BRAND_NAME);
  const [brandLogo, setBrandLogo] = useState(() => localStorage.getItem(BRAND_LOGO_KEY) || null);

  const settings = { companyName: "Ahmed Enterprises", currency: "PKR - Pakistani Rupee", fiscalYearStart: "January" };
  const profile = user
    ? { name: user.name, role: "Finance admin", email: user.email }
    : { name: "", role: "", email: "" };

  const incomeCategories = categories.filter((c) => c.type === "Income").map((c) => c.name);
  const expenseCategories = categories.filter((c) => c.type === "Expense").map((c) => c.name);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [accRes, txRes, invRes, budRes, catRes] = await Promise.all([
        api.get("/accounts"),
        api.get("/transactions"),
        api.get("/invoices"),
        api.get("/budgets"),
        api.get("/categories"),
      ]);
      setAccounts(accRes.data);
      setTransactions(txRes.data);
      setInvoices(invRes.data);
      setBudgets(budRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to load finance data", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addAccount = async (account) => {
    const res = await api.post("/accounts", account);
    setAccounts((prev) => [...prev, res.data]);
  };

  const deleteAccount = async (id) => {
    await api.delete(`/accounts/${id}`);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const addTransaction = async (tx) => {
    const account = accounts.find((a) => a.name === tx.account);
    const res = await api.post("/transactions", {
      type: tx.type,
      amount: tx.amount,
      date: tx.date,
      category: tx.category,
      description: tx.description,
      accountId: account?.id,
    });
    await fetchAll();
    return res.data;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    await fetchAll();
  };

  const addExpense = async (expense) => {
    await addTransaction({ ...expense, type: "Expense" });
  };

  const addInvoice = async (invoice) => {
    const res = await api.post("/invoices", invoice);
    setInvoices((prev) => [res.data, ...prev]);
  };

  const deleteInvoice = async (id) => {
    await api.delete(`/invoices/${id}`);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };

  const markInvoiceStatus = async (id, status) => {
    const res = await api.patch(`/invoices/${id}/status`, { status });
    setInvoices((prev) => prev.map((i) => (i.id === id ? res.data : i)));
  };

  const setBudgetForCategory = async (category, budgeted) => {
    const res = await api.post("/budgets", { category, budgeted });
    setBudgets((prev) => {
      const exists = prev.some((b) => b.category === category);
      return exists ? prev.map((b) => (b.category === category ? res.data : b)) : [...prev, res.data];
    });
  };

  const deleteBudget = async (id) => {
    await api.delete(`/budgets/${id}`);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const addCategory = async (name, type) => {
    const res = await api.post("/categories", { name, type });
    setCategories((prev) => [...prev, res.data]);
  };

  const removeCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateBrandName = (name) => {
    const finalName = name.trim() || DEFAULT_BRAND_NAME;
    setBrandName(finalName);
    localStorage.setItem(BRAND_NAME_KEY, finalName);
  };

  const updateBrandLogo = (dataUrl) => {
    setBrandLogo(dataUrl);
    if (dataUrl) localStorage.setItem(BRAND_LOGO_KEY, dataUrl);
    else localStorage.removeItem(BRAND_LOGO_KEY);
  };

  const updateSettings = () => {};
  const updateProfile = () => {};

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        invoices,
        budgets,
        categories,
        incomeCategories,
        expenseCategories,
        settings,
        profile,
        loading,
        brandName,
        brandLogo,
        updateBrandName,
        updateBrandLogo,
        addAccount,
        deleteAccount,
        addTransaction,
        deleteTransaction,
        addInvoice,
        deleteInvoice,
        markInvoiceStatus,
        addExpense,
        setBudgetForCategory,
        deleteBudget,
        addCategory,
        removeCategory,
        updateSettings,
        updateProfile,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}