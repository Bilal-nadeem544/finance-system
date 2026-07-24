import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { useFinance } from "../context/FinanceContext";

export default function Budgets() {
  const { budgets, categories, setBudgetForCategory, deleteBudget } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: categories[0] || "", budgeted: "" });

  const totalBudgeted = budgets.reduce((s, b) => s + b.budgeted, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.budgeted) return;
    await setBudgetForCategory(form.category, form.budgeted);
    setForm({ category: categories[0] || "", budgeted: "" });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ye budget delete karna hai?")) {
      await deleteBudget(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Budgets</h1>
          <p className="text-sm text-gray-500">Compare planned budgets against actual spending</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <Plus size={16} />
          Set Budget
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500">Total budgeted</p>
          <p className="text-xl font-semibold text-gray-800 mt-1">${totalBudgeted.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500">Total spent</p>
          <p className="text-xl font-semibold text-gray-800 mt-1">${totalSpent.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-5">
        <h2 className="text-sm font-semibold text-gray-800">Budget vs actual</h2>
        {budgets.map((b) => {
          const pct = Math.min(Math.round((b.spent / b.budgeted) * 100), 100);
          const over = b.spent > b.budgeted;
          return (
            <div key={b.id}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-800 font-medium">{b.category}</span>
                <div className="flex items-center gap-2">
                  <span className={over ? "text-red-500" : "text-gray-500"}>
                    ${b.spent.toLocaleString()} / ${b.budgeted.toLocaleString()}
                  </span>
                  <button onClick={() => handleDelete(b.id)} className="text-gray-300 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${over ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
              </div>
              {over && <p className="text-xs text-red-500 mt-1">Over budget by ${(b.spent - b.budgeted).toLocaleString()}</p>}
            </div>
          );
        })}
        {budgets.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Koi budget set nahi hua abhi.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Set Budget">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {categories.length === 0 && <option value="">Pehle koi category add karo</option>}
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Budgeted amount</label>
            <input type="number" required value={form.budgeted} onChange={(e) => setForm({ ...form, budgeted: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition-colors">
            Save Budget
          </button>
        </form>
      </Modal>
    </div>
  );
}