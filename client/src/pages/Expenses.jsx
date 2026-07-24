import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { useFinance } from "../context/FinanceContext";

const categoryColors = {
  Payroll: "bg-green-500",
  Operations: "bg-blue-500",
  Marketing: "bg-purple-500",
  Other: "bg-orange-500",
  Sales: "bg-teal-500",
};

export default function Expenses() {
  const { transactions, accounts, categories, addExpense, deleteTransaction } = useFinance();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: categories[0] || "",
    account: accounts[0]?.name || "",
    description: "",
    amount: "",
  });

  const expenses = transactions.filter((t) => t.type === "Expense");
  const filtered = expenses.filter((e) => filter === "All" || e.category === filter);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.account) return;
    await addExpense(form);
    setForm({ ...form, description: "", amount: "" });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ye expense delete karna hai?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Expenses</h1>
          <p className="text-sm text-gray-500">Track and categorize business expenses</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-xs">
        <p className="text-xs text-gray-500">Total expenses</p>
        <p className="text-xl font-semibold text-gray-800 mt-1">${totalExpenses.toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">All expenses</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
            <option>All</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {accounts.length === 0 && (
          <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
            Pehle Accounts page se kam az kam ek account add karo.
          </p>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Description</th>
              <th className="pb-2 font-medium">Category</th>
              <th className="pb-2 font-medium">Account</th>
              <th className="pb-2 font-medium text-right">Amount</th>
              <th className="pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                <td className="py-2.5 text-gray-800">{e.description}</td>
                <td className="py-2.5">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className={`w-2 h-2 rounded-full inline-block ${categoryColors[e.category] || "bg-gray-400"}`} />
                    {e.category}
                  </span>
                </td>
                <td className="py-2.5 text-gray-500">{e.account?.name || "—"}</td>
                <td className="py-2.5 text-right text-gray-800 font-medium">${e.amount.toLocaleString()}</td>
                <td className="py-2.5">
                  <button onClick={() => handleDelete(e.id)} className="text-gray-300 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">No expenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Expense">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {categories.length === 0 && <option value="">Pehle koi category add karo</option>}
              {categories.map((c) => <option key={c}>{c}</option>)}
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
            Add Expense
          </button>
        </form>
      </Modal>
    </div>
  );
}