import { useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import Modal from "../components/Modal";
import { useFinance } from "../context/FinanceContext";

export default function Categories() {
  const { categories, addCategory, removeCategory } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Expense" });

  const incomeCats = categories.filter((c) => c.type === "Income");
  const expenseCats = categories.filter((c) => c.type === "Expense");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await addCategory(form.name.trim(), form.type);
    setForm({ name: "", type: "Expense" });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ye category delete karna hai?")) {
      await removeCategory(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500">Income aur Expense categories manage karo</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">Income categories</h2>
          </div>
          <div className="space-y-2">
            {incomeCats.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-800">{cat.name}</span>
                <button onClick={() => handleDelete(cat.id)} className="text-gray-300 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {incomeCats.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Koi income category nahi.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <TrendingDown size={16} className="text-red-500" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">Expense categories</h2>
          </div>
          <div className="space-y-2">
            {expenseCats.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-800">{cat.name}</span>
                <button onClick={() => handleDelete(cat.id)} className="text-gray-300 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {expenseCats.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Koi expense category nahi.</p>
            )}
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Category">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "Income" })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                  form.type === "Income" ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-600"
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "Expense" })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                  form.type === "Expense" ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-600"
                }`}
              >
                Expense
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={form.type === "Income" ? "e.g. Sales, Consulting" : "e.g. Payroll, Marketing"}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition-colors">
            Add Category
          </button>
        </form>
      </Modal>
    </div>
  );
}