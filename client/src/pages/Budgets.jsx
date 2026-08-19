import { useState, useEffect } from "react";
import { Plus, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { useFinance } from "../context/FinanceContext";

export default function Transactions() {
  const { transactions, accounts, incomeCategories, expenseCategories, addTransaction, deleteTransaction } = useFinance();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "Income",
    category: "",
    account: accounts[0]?.name || "",
    description: "",
    amount: "",
  });

  const activeCategories = form.type === "Income" ? incomeCategories : expenseCategories;

  useEffect(() => {
    setForm((f) => ({ ...f, category: activeCategories[0] || "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.type]);

  const filtered = transactions.filter((t) => filter === "All" || t.type === filter);
  const totalIncome = transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.account || !form.category) return;
    await addTransaction(form);
    setForm({ ...form, description: "", amount: "" });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ye transaction delete karna hai?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Transactions</h1>
          <p className="text-sm text-gray-500">All income and expense records</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <ArrowUpRight size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total income</p>
            <p className="text-lg font-semibold text-gray-800">${totalIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px] flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <ArrowDownRight size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total expense</p>
            <p className="text-lg font-semibold text-gray-800">${totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Recent transactions</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
            <option>All</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Description</th>
              <th className="pb-2 font-medium">Category</th>
              <th className="pb-2 font-medium">Account</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium text-right">Amount</th>
              <th className="pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                <td className="py-2.5 text-gray-800">{t.description}</td>
                <td className="py-2.5 text-gray-500">{t.category}</td>
                <td className="py-2.5 text-gray-500">{t.account?.name || "—"}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.type === "Income" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                    {t.type}
                  </span>
                </td>
                <td className={`py-2.5 text-right font-medium ${t.type === "Income" ? "text-green-600" : "text-red-500"}`}>
                  {t.type === "Income" ? "+" : "-"}${t.amount.toLocaleString()}
                </td>
                <td className="py-2.5">
                  <button onClick={() => handleDelete(t.id)} className="text-gray-300 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category ({form.type})</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {activeCategories.length === 0 && <option value="">Pehle Categories page se {form.type} category add karo</option>}
              {activeCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Account</label>
            <select value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {accounts.length === 0 && <option value="">Pehle koi account add karo</option>}
              {accounts.map((a) => <option key={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input type="text" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Amount</label>
            <input type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition-colors">
            Add Transaction
          </button>
        </form>
      </Modal>
    </div>
  );
}