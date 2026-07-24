import { useState } from "react";
import { Plus, Landmark, Wallet, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { useFinance } from "../context/FinanceContext";

export default function Accounts() {
  const { accounts, addAccount, deleteAccount } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Bank", bank: "", balance: "" });

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.balance === "") return;
    await addAccount(form);
    setForm({ name: "", type: "Bank", bank: "", balance: "" });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ye account delete karna hai? Iससे jude transactions bhi affect ho sakte hain.")) {
      await deleteAccount(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Accounts</h1>
          <p className="text-sm text-gray-500">Total balance across all accounts: ${totalBalance.toLocaleString()}</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <Plus size={16} />
          Add Account
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {accounts.map((acc) => {
          const Icon = acc.type === "Cash" ? Wallet : Landmark;
          return (
            <div key={acc.id} className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[240px] relative">
              <button
                onClick={() => handleDelete(acc.id)}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-500"
                title="Delete account"
              >
                <Trash2 size={15} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <Icon size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{acc.name}</p>
                  <p className="text-xs text-gray-500">{acc.type} · {acc.bank}</p>
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-800 mt-4">${acc.balance.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">Current balance</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">All accounts</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-2 font-medium">Account name</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Bank</th>
              <th className="pb-2 font-medium">Balance</th>
              <th className="pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 text-gray-800">{acc.name}</td>
                <td className="py-2.5 text-gray-500">{acc.type}</td>
                <td className="py-2.5 text-gray-500">{acc.bank}</td>
                <td className="py-2.5 text-gray-800 font-medium">${acc.balance.toLocaleString()}</td>
                <td className="py-2.5">
                  <button onClick={() => handleDelete(acc.id)} className="text-xs text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Account">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Account name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Bank</option>
              <option>Cash</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bank name (optional)</label>
            <input type="text" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Opening balance</label>
            <input type="number" required value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition-colors">
            Add Account
          </button>
        </form>
      </Modal>
    </div>
  );
}