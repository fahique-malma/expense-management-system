export const CATEGORIES = [
  { key: "Housing", emoji: "🏠", color: "#5c3bfe", forBills: true },
  { key: "Groceries", emoji: "🛒", color: "#3b9ffe", forBills: false },
  { key: "Shopping", emoji: "🛍️", color: "#9333ea", forBills: false },
  { key: "Food & Dining", emoji: "🍽️", color: "#f24e4e", forBills: false },
  { key: "Transportation", emoji: "🚗", color: "#f59e0b", forBills: false },
  { key: "Health", emoji: "💊", color: "#00c48c", forBills: true },
  { key: "Utilities", emoji: "⚡", color: "#a855f7", forBills: true },
  { key: "Entertainment", emoji: "🎬", color: "#ec4899", forBills: true },
  { key: "Education", emoji: "📚", color: "#06b6d4", forBills: true },
  { key: "Travel", emoji: "✈️", color: "#0ea5e9", forBills: false },
  { key: "Fitness", emoji: "🏋️", color: "#22c55e", forBills: false },
  { key: "Personal Care", emoji: "💅", color: "#f97316", forBills: false },
  { key: "Subscriptions", emoji: "📺", color: "#8b5cf6", forBills: true },
  { key: "Insurance", emoji: "🛡️", color: "#64748b", forBills: true },
  { key: "Income", emoji: "💰", color: "#00c48c", forBills: false },
  { key: "Other", emoji: "📦", color: "#94a3b8", forBills: true },
];

export const CAT_COLORS = {};
export const CAT_EMOJI = {};
CATEGORIES.forEach((c) => {
  CAT_COLORS[c.key] = c.color;
  CAT_EMOJI[c.key] = c.emoji;
});
