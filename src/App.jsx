import { useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import BottomNav from "./components/BottomNav";
import HomePage from "./components/HomePage";
import TransactionsPage from "./components/TransactionsPage";
import ForecastPage from "./components/ForecastPage";
import TxModal from "./components/TxModal";
import BillModal from "./components/BillModal";
import ProfileModal from "./components/ProfileModal";
import DatePickerModal from "./components/DatePickerModal";
import CategoryPickerModal from "./components/CategoryPickerModal";
import Toast from "./components/Toast";
import { useAppState } from "./hooks/useAppState";
import { CATEGORIES } from "./data/categories";
import { addOneMonth, todayISO } from "./utils/format";

const emptyTxForm = () => ({
  type: "expense",
  name: "",
  amount: "",
  cat: "Housing",
  date: todayISO(),
});
const emptyBillForm = () => ({
  name: "",
  amount: "",
  due: "",
  cat: "Housing",
  recurring: false,
});

export default function App() {
  const [appState, setAppState] = useAppState();
  const { userName, transactions, bills } = appState;

  const [page, setPage] = useState("home");
  const [txFilter, setTxFilter] = useState("all");

  const now = new Date();
  const [forecastYear, setForecastYear] = useState(now.getFullYear());
  const [forecastMonth, setForecastMonth] = useState(now.getMonth());

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTxId, setEditingTxId] = useState(null);
  const [txForm, setTxForm] = useState(emptyTxForm());

  const [billModalOpen, setBillModalOpen] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);
  const [billForm, setBillForm] = useState(emptyBillForm());


  const [datePicker, setDatePicker] = useState({ open: false, target: null, iso: "" });
  const [categoryPicker, setCategoryPicker] = useState({ open: false, target: null });

  const [toast, setToast] = useState({ message: "", show: false });
  const toastTimerRef = useRef(null);

  function showToast(message) {
    setToast({ message, show: true });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  }
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  function openProfile() {
    setProfileModalOpen(true);
  }
  function saveProfile(name) {
    const n = name.trim();
    if (!n) return showToast("Please enter a name");
    setAppState((s) => ({ ...s, userName: n }));
    setProfileModalOpen(false);
    showToast("Name updated!");
  }

  function openTxModal(id) {
    if (id) {
      const tx = transactions.find((t) => t.id === id);
      if (!tx) return;
      setEditingTxId(id);
      setTxForm({ type: tx.type, name: tx.name, amount: String(tx.amount), cat: tx.cat, date: tx.date });
    } else {
      setEditingTxId(null);
      setTxForm(emptyTxForm());
    }
    setTxModalOpen(true);
  }
  function closeTxModal() {
    setTxModalOpen(false);
    setEditingTxId(null);
  }
  function updateTxForm(patch) {
    setTxForm((f) => {
      const next = { ...f, ...patch };
      if (patch.type === "income") {
        next.cat = "Income";
      } else if (patch.type === "expense" && f.cat === "Income") {
        next.cat = "Housing";
      }
      return next;
    });
  }
  function submitTx() {
    const name = txForm.name.trim();
    const amount = parseFloat(txForm.amount);
    const { cat, date, type } = txForm;
    if (!name || isNaN(amount) || amount <= 0 || !date) return showToast("Please fill all fields");

    setAppState((s) => {
      if (editingTxId) {
        return {
          ...s,
          transactions: s.transactions.map((t) =>
            t.id === editingTxId ? { ...t, name, amount, cat, date, type } : t,
          ),
        };
      }
      return {
        ...s,
        transactions: [{ id: Date.now(), name, amount, cat, date, type }, ...s.transactions],
      };
    });

    if (editingTxId) showToast("Transaction updated ✏️");
    else showToast(type === "income" ? "Income added! 💰" : "Expense recorded 📝");
    closeTxModal();
  }
  function deleteTransaction(id) {
    setAppState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
    showToast("Transaction deleted");
  }
  function addTxAsBill(id) {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    const billCat = CATEGORIES.find((c) => c.key === tx.cat && c.forBills) ? tx.cat : "Other";
    setEditingBillId(null);
    setBillForm({ ...emptyBillForm(), name: tx.name, amount: String(tx.amount), cat: billCat });
    setBillModalOpen(true);
    showToast("Pick a due date to track this as a bill");
  }

  function openBillModal(id) {
    if (id) {
      const b = bills.find((x) => x.id === id);
      if (!b) return;
      setEditingBillId(id);
      setBillForm({ name: b.name, amount: String(b.amount), due: b.due, cat: b.cat, recurring: !!b.recurring });
    } else {
      setEditingBillId(null);
      setBillForm(emptyBillForm());
    }
    setBillModalOpen(true);
  }
  function closeBillModal() {
    setBillModalOpen(false);
    setEditingBillId(null);
  }
  function updateBillForm(patch) {
    setBillForm((f) => ({ ...f, ...patch }));
  }
  function submitBill() {
    const name = billForm.name.trim();
    const amount = parseFloat(billForm.amount);
    const { due, cat, recurring } = billForm;
    if (!name || isNaN(amount) || amount <= 0 || !due) return showToast("Please fill all fields");

    setAppState((s) => {
      if (editingBillId) {
        return {
          ...s,
          bills: s.bills.map((b) => (b.id === editingBillId ? { ...b, name, amount, due, cat, recurring } : b)),
        };
      }
      return { ...s, bills: [...s.bills, { id: Date.now(), name, amount, due, cat, recurring }] };
    });

    showToast(editingBillId ? "Bill updated ✏️" : "Bill added! 🗓️");
    closeBillModal();
  }
  function deleteBill(id) {
    setAppState((s) => ({ ...s, bills: s.bills.filter((b) => b.id !== id) }));
    showToast("Bill removed");
  }
  function payBill(id) {
    const b = bills.find((x) => x.id === id);
    if (!b) return;
    setAppState((s) => {
      const newTx = {
        id: Date.now(),
        name: b.name,
        amount: b.amount,
        cat: b.cat,
        date: todayISO(),
        type: "expense",
      };
      const nextBills = b.recurring
        ? s.bills.map((x) => (x.id === id ? { ...x, due: addOneMonth(x.due) } : x))
        : s.bills.filter((x) => x.id !== id);
      return { ...s, transactions: [newTx, ...s.transactions], bills: nextBills };
    });
    showToast("Marked as paid ✅");
  }

  function openDatePicker(target) {
    const iso = target === "tx" ? txForm.date : billForm.due;
    setDatePicker({ open: true, target, iso: iso || "" });
  }
  function closeDatePicker() {
    setDatePicker((d) => ({ ...d, open: false }));
  }
  function pickDate(iso) {
    if (datePicker.target === "tx") updateTxForm({ date: iso });
    else if (datePicker.target === "bill") updateBillForm({ due: iso });
    closeDatePicker();
  }

  function openCategoryPicker(target) {
    setCategoryPicker({ open: true, target });
  }
  function closeCategoryPicker() {
    setCategoryPicker((c) => ({ ...c, open: false }));
  }
  function pickCategory(key) {
    if (categoryPicker.target === "tx") updateTxForm({ cat: key });
    else if (categoryPicker.target === "bill") updateBillForm({ cat: key });
    closeCategoryPicker();
  }

  function shiftForecastMonth(delta) {
    let y = forecastYear;
    let m = forecastMonth + delta;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    const n = new Date();
    if (y > n.getFullYear() || (y === n.getFullYear() && m > n.getMonth())) return;
    setForecastYear(y);
    setForecastMonth(m);
  }

  return (
    <>
      <Nav userName={userName} currentPage={page} onNavigate={setPage} onOpenProfile={openProfile} />

      {page === "home" && (
        <HomePage
          userName={userName}
          transactions={transactions}
          bills={bills}
          onAddBill={() => openBillModal()}
          onEditBill={openBillModal}
          onPayBill={payBill}
          onDeleteBill={deleteBill}
        />
      )}

      {page === "transactions" && (
        <TransactionsPage
          transactions={transactions}
          filter={txFilter}
          onFilterChange={setTxFilter}
          onAddTransaction={() => openTxModal()}
          onEditTransaction={openTxModal}
          onDeleteTransaction={deleteTransaction}
          onAddTxAsBill={addTxAsBill}
        />
      )}

      {page === "forecast" && (
        <ForecastPage
          transactions={transactions}
          year={forecastYear}
          month={forecastMonth}
          onShiftMonth={shiftForecastMonth}
        />
      )}

      <BottomNav currentPage={page} onNavigate={setPage} />

      <TxModal
        open={txModalOpen}
        isEditing={!!editingTxId}
        form={txForm}
        onChange={updateTxForm}
        onOpenDatePicker={() => openDatePicker("tx")}
        onOpenCategoryPicker={() => openCategoryPicker("tx")}
        onSubmit={submitTx}
        onClose={closeTxModal}
      />

      <BillModal
        open={billModalOpen}
        isEditing={!!editingBillId}
        form={billForm}
        onChange={updateBillForm}
        onOpenDatePicker={() => openDatePicker("bill")}
        onOpenCategoryPicker={() => openCategoryPicker("bill")}
        onSubmit={submitBill}
        onClose={closeBillModal}
      />

      {profileModalOpen && (
        <ProfileModal currentName={userName} onSave={saveProfile} onClose={() => setProfileModalOpen(false)} />
      )}

      {datePicker.open && (
        <DatePickerModal initialIso={datePicker.iso} onPick={pickDate} onClose={closeDatePicker} />
      )}

      <CategoryPickerModal
        open={categoryPicker.open}
        current={categoryPicker.target === "tx" ? txForm.cat : billForm.cat}
        onPick={pickCategory}
        onClose={closeCategoryPicker}
      />

      <Toast message={toast.message} show={toast.show} />
    </>
  );
}
