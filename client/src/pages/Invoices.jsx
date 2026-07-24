import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { useFinance } from "../context/FinanceContext";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-500",
  Paid: "bg-green-50 text-green-600",
};

export default function Invoices() {
  const { invoices, addInvoice, markInvoiceStatus, deleteInvoice } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client: "", issueDate: new Date().toISOString().slice(0, 10), dueDate: "", amount: "" });

  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.client || !form.amount || !form.dueDate) return;
    await addInvoice(form);
    setForm({ client: "", issueDate: new Date().toISOString().slice(0, 10), dueDate: "", amount: "" });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ye invoice delete karna hai?")) {
      await deleteInvoice(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Invoices</h1>
          <p className="text-sm text-gray-500">Track client invoices and payment status</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <Plus size={16} />
          New Invoice
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500">Paid</p>
          <p className="text-xl font-semibold text-green-600 mt-1">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-xl font-semibold text-amber-600 mt-1">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500">Overdue</p>
          <p className="text-xl font-semibold text-red-500 mt-1">${totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">All invoices</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-2 font-medium">Invoice #</th>
              <th className="pb-2 font-medium">Client</th>
              <th className="pb-2 font-medium">Issue date</th>
              <th className="pb-2 font-medium">Due date</th>
              <th className="pb-2 font-medium text-right">Amount</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 text-gray-800 font-medium">{inv.invoiceNo}</td>
                <td className="py-2.5 text-gray-800">{inv.client}</td>
                <td className="py-2.5 text-gray-500">{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td className="py-2.5 text-gray-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="py-2.5 text-right text-gray-800 font-medium">${inv.amount.toLocaleString()}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>{inv.status}</span>
                </td>
                <td className="py-2.5">
                  <div className="flex items-center gap-3">
                    {inv.status !== "Paid" && (
                      <button onClick={() => markInvoiceStatus(inv.id, "Paid")} className="text-xs text-green-600 font-medium hover:underline">
                        Mark as Paid
                      </button>
                    )}
                    <button onClick={() => handleDelete(inv.id)} className="text-gray-300 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Invoice">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Client name</label>
            <input type="text" required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Issue date</label>
            <input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Due date</label>
            <input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Amount</label>
            <input type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition-colors">
            Create Invoice
          </button>
        </form>
      </Modal>
    </div>
  );
}