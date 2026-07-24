import { Link } from "react-router-dom";
import { TrendingUp, FileCheck, AlertCircle, Wallet2, Clock, UserPlus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "../components/StatCard";
import { useFinance } from "../context/FinanceContext";
import { getMonthlyBreakdown, getExpensesByCategory } from "../utils/financeCalculations";

const fmtMoney = (n) => `$${n.toLocaleString()}`;

const statusStyles = {
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-500",
  Paid: "bg-green-50 text-green-600",
};

export default function Dashboard() {
  const { transactions, invoices, profile } = useFinance();

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const totalRevenue = transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
  const monthlyExpenses = transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const invoicesPaid = invoices.filter((i) => i.status === "Paid").length;
  const overdueInvoices = invoices.filter((i) => i.status === "Overdue").length;
  const pendingPayments = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const pendingInvoices = invoices.filter((i) => i.status !== "Paid").slice(0, 3);

  const todayStr = new Date().toDateString();
  const newClientsToday = new Set(
    invoices
      .filter((i) => new Date(i.issueDate).toDateString() === todayStr)
      .map((i) => i.client)
  ).size;

  const revenueVsExpenses = getMonthlyBreakdown(transactions);
  const expensesByCategory = getExpensesByCategory(transactions);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {profile.name}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock size={14} />
          {today}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <StatCard icon={TrendingUp} iconBg="bg-green-50" iconColor="text-green-600" label="Total revenue" value={fmtMoney(totalRevenue)} />
        <StatCard icon={FileCheck} iconBg="bg-blue-50" iconColor="text-blue-600" label="Invoices paid" value={invoicesPaid} />
        <StatCard icon={AlertCircle} iconBg="bg-orange-50" iconColor="text-orange-500" label="Overdue invoices" value={overdueInvoices} />
        <StatCard icon={Wallet2} iconBg="bg-purple-50" iconColor="text-purple-600" label="Monthly expenses" value={fmtMoney(monthlyExpenses)} />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
            <Clock size={18} className="text-pink-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending payments</p>
            <p className="text-lg font-semibold text-gray-800">{fmtMoney(pendingPayments)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
            <UserPlus size={18} className="text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">New clients today</p>
            <p className="text-lg font-semibold text-gray-800">{newClientsToday}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Revenue vs expenses</h2>
          {revenueVsExpenses.length === 0 ? (
            <p className="text-sm text-gray-400 py-16 text-center">No transactions yet — add some to see this chart.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueVsExpenses}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" name="Revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Revenue</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Expenses</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Expenses by category</h2>
          {expensesByCategory.length === 0 ? (
            <p className="text-sm text-gray-400 py-16 text-center">No expenses yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={expensesByCategory} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {expensesByCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {expensesByCategory.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </span>
                    <span className="text-gray-800 font-medium">{c.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">Pending invoices</h2>
          <Link to="/invoices" className="text-sm text-green-600 font-medium hover:underline">View all</Link>
        </div>
        {pendingInvoices.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No pending invoices.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-2 font-medium">Client</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Due date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-800">{inv.client}</td>
                  <td className="py-2.5 text-gray-800">{fmtMoney(inv.amount)}</td>
                  <td className="py-2.5 text-gray-500">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}