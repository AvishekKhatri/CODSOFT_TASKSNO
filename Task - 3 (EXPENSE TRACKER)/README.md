# Spendora - Premium Expense Tracker Web Application

A fully functional, responsive, and visually stunning client-side personal finance management dashboard built using HTML5, CSS3, and Vanilla JavaScript (ES6+).

## Features

- **Premium Glassmorphic UI**: Vibrant, responsive sidebar and dashboard widgets designed to replicate look and feel of modern finance apps.
- **Dynamic Stats Calculations**: Instantly computes net balance, total income, total expenses, monthly savings, and financial health score.
- **Data Visualizations**: Three interactive charts powered by Chart.js:
  - **Expense Breakdown** (Doughnut Chart)
  - **Income vs Expenses monthly comparison** (Grouped Bar Chart)
  - **Spending Trend** (Smooth Line Chart for current month)
- **Local Storage Persistence**: Transactions, active theme, set currency, and budget limits persist automatically on browser refresh.
- **Dark & Light Mode**: Seamless dark and light themes with preference saving and OS preference auto-detection.
- **Search & Filters**: Instant fuzzy search with custom multi-criteria date, category, and type filters.
- **CSV Import/Export**: Back up and restore your transaction log using standard CSV format.
- **Budget Warnings**: Get dynamic warnings and alerts when expenses cross 85% and 100% of your configured budget limits.
- **Print to PDF**: Built-in print CSS rules styling clean financial report printable files.

## Directory Structure

```text
expense-tracker/
│
├── index.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
│
└── js/
    ├── app.js
    ├── storage.js
    ├── ui.js
    ├── charts.js
    ├── validation.js
    ├── statistics.js
    └── theme.js
```

## How to Run

1. Open `index.html` directly in any web browser.
2. No local server or build tools required.
