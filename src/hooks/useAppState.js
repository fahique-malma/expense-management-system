import { useEffect, useState } from "react";
import { addOneMonth, todayISO } from "../utils/format";

const STORAGE_KEY = "finflow_state_v1";

function loadInitialState() {
  const defaults = { userName: "Fahiq", transactions: [], bills: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return {
        userName: saved.userName || "User",
        transactions: saved.transactions || [],
        bills: saved.bills || [],
      };
    }
  } catch (e) {
    console.warn("Could not load state:", e);
  }
  return defaults;
}


function rollOverBills(bills) {
  const todayStr = todayISO();
  let changed = false;
  const next = bills.map((b) => {
    if (!b.recurring) return b;
    let due = b.due;
    let guard = 0;
    while (due < todayStr && guard < 36) {
      due = addOneMonth(due);
      guard++;
      changed = true;
    }
    return changed ? { ...b, due } : b;
  });
  return { bills: next, changed };
}

export function useAppState() {
  const [state, setState] = useState(() => {
    const initial = loadInitialState();
    const { bills, changed } = rollOverBills(initial.bills);
    return changed ? { ...initial, bills } : initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          userName: state.userName,
          transactions: state.transactions,
          bills: state.bills,
        }),
      );
    } catch (e) {
      console.warn("Could not save state:", e);
    }
  }, [state]);

  return [state, setState];
}
