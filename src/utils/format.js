export const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export function fmtK(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + Math.round(n);
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(ds) {
  const d = new Date(ds + "T00:00:00");
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  });
}

export function addOneMonth(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
}

export const getTotalIncome = (transactions) =>
  transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

export const getTotalExpense = (transactions) =>
  transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

export const getBalance = (transactions) =>
  getTotalIncome(transactions) - getTotalExpense(transactions);
