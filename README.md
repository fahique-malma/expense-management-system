# expense-management-system

A modern Personal Finance Management Web Application built with React, that helps users track income, expenses, upcoming bills, and monthly cash flow. The application provides an intuitive dashboard for monitoring financial activities and visualizing spending patterns through an interactive chart.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 🚀 Live Demo

🔗 https://expense-management-system-kohl.vercel.app/

---

## ✨ Features

### 📊 Financial Dashboard

* View current account balance
* Track total income and expenses
* Real-time financial summary
* Animated balance updates

### 💸 Transaction Management

* Add new transactions
* Edit existing transactions
* Delete transactions
* Categorize income and expenses
* Filter transactions by type
* Date-based transaction tracking

### 🗓️ Bill Management

* Add upcoming bills
* Edit and delete bills
* Mark bills as paid
* Support for recurring monthly bills
* Automatic recurring bill rollover
* Due date tracking

### 📈 Cash Flow Forecast

* Interactive Income vs Expense chart (built with the Canvas API)
* Monthly financial overview with month navigation
* Spending trend visualization with hover tooltips
* Balance projections
* Category-wise spending breakdown

### 👤 User Personalization

* Custom user profile name
* Personalized dashboard greeting

### 💾 Local Data Persistence

* Stores data using Browser Local Storage
* No external database required
* Data remains available after page refresh

---

## 🛠️ Technologies Used

* React 19
* Vite
* JavaScript (ES6+)
* Canvas API
* Local Storage API
* CSS3

---

## 📂 Project Structure

```bash
expense-management-system/
│
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx                 
│   ├── main.jsx                 
│   ├── index.css                
│   ├── components/
│   │   ├── Nav.jsx
│   │   ├── BottomNav.jsx
│   │   ├── HomePage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── ForecastPage.jsx
│   │   ├── ForecastChart.jsx    
│   │   ├── TxModal.jsx
│   │   ├── BillModal.jsx
│   │   ├── ProfileModal.jsx
│   │   ├── DatePickerModal.jsx
│   │   ├── CategoryPickerModal.jsx
│   │   ├── AnimatedNumber.jsx
│   │   └── Toast.jsx
│   ├── data/
│   │   └── categories.js        
│   ├── hooks/
│   │   └── useAppState.js       
│   └── utils/
│       └── format.js            
└── README.md
```

---

## ⚙️ How It Works

### Transaction Flow

1. User adds an income or expense transaction.
2. Transaction is stored in React application state.
3. Data is persisted to Local Storage via the `useAppState` hook.
4. Dashboard updates automatically.
5. Forecast chart recalculates financial trends.

### Bill Management Flow

1. User creates an upcoming bill.
2. Bill is stored locally.
3. User can mark the bill as paid.
4. Payment is automatically recorded as an expense transaction.
5. Recurring bills automatically move to the next due date.

---

## 📊 Core Functionalities

### Income Tracking

* Record salary, freelance earnings, bonuses, and other income sources.

### Expense Tracking

* Monitor daily spending across multiple categories.

### Spending Categories

* Housing
* Groceries
* Shopping
* Food & Dining
* Transportation
* Health
* Utilities
* Entertainment
* Education
* Travel
* Fitness
* Personal Care
* Subscriptions
* Insurance
* Income
* Other

### Financial Forecasting

The application generates cumulative monthly financial trends by:

* Aggregating daily income
* Aggregating daily expenses
* Calculating running balances
* Visualizing trends using the Canvas API

---

## Data Storage

All application data is stored locally in the browser using Local Storage.

Stored Information:

* User Profile
* Transactions
* Bills

---

### 📱 Responsive Design

* Mobile-friendly interface
* Tablet support
* Desktop optimized layout

---

## 🎯 Learning Outcomes

This project demonstrates practical knowledge of:

* React Component Architecture
* React Hooks (`useState`, `useEffect`, `useRef`)
* Custom Hooks for State Persistence
* Controlled Forms
* Event Handling
* Responsive Web Design
* Browser Storage APIs
* Data Visualization
* Single Page Application Concepts
* Financial Dashboard Development

---

## 🔮 Future Improvements

* User Authentication
* Cloud Database Integration
* Budget Planning Module
* Financial Goal Tracking
* Multi-Currency Support
* Expense Analytics Dashboard
* Backend API Integration

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

```

---

## 👨‍💻 Author

**Mohammed Fahique**

### ⭐ If you found this project useful, please give it a Star on GitHub!
