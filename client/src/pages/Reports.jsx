import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { getMonthlyBreakdown } from "../utils/financeCalculations";

export default function Reports() {
  const { transactions } = useFinance();

  const totalIncome = transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const monthlyReport = getMonthlyBreakdown(transactions);

  const handleExport = () => {
    const header = "Month,Income,Expenses,Net\n";
    const rows = monthlyReport.map((m) => `${m.month},${m.income},${m.expenses},${m.income - m.expenses}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finance-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-500">Monthly and yearly financial summary</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500">Total income</p>
          <p className="text-xl font-semibold text-green-600 mt-1">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500">Total expenses</p>
          <p className="text-xl font-semibold text-red-500 mt-1">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
          <p className="text-xs text-gray-500">Net profit</p>
          <p className="text-xl font-semibold text-gray-800 mt-1">${netProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Monthly income vs expenses</h2>
        {monthlyReport.length === 0 ? (
          <p className="text-sm text-gray-400 py-16 text-center">No transactions yet — add some to see this chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyReport}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Monthly breakdown</h2>
        {monthlyReport.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No data yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-2 font-medium">Month</th>
                <th className="pb-2 font-medium text-right">Income</th>
                <th className="pb-2 font-medium text-right">Expenses</th>
                <th className="pb-2 font-medium text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {monthlyReport.map((m) => (
                <tr key={m.month} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-800">{m.month}</td>
                  <td className="py-2.5 text-right text-green-600">${m.income.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-red-500">${m.expenses.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-gray-800 font-medium">${(m.income - m.expenses).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}