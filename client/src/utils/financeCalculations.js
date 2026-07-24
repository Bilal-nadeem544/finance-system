const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CATEGORY_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f97316", "#ec4899", "#14b8a6", "#eab308"];

export function getMonthlyBreakdown(transactions) {
  const map = {};

  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map[key]) {
      map[key] = { month: MONTH_LABELS[d.getMonth()], income: 0, expenses: 0, sortKey: d.getFullYear() * 12 + d.getMonth() };
    }
    if (t.type === "Income") map[key].income += t.amount;
    else map[key].expenses += t.amount;
  });

  return Object.values(map).sort((a, b) => a.sortKey - b.sortKey);
}

export function getExpensesByCategory(transactions) {
  const map = {};
  const expenses = transactions.filter((t) => t.type === "Expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);

  expenses.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });

  return Object.entries(map).map(([name, amount], i) => ({
    name,
    value: total > 0 ? Math.round((amount / total) * 100) : 0,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));
}