/**
 * Charts Module
 * Manages rendering and updating of Chart.js charts.
 */

class ChartsManager {
    constructor() {
        this.pieChart = null;
        this.barChart = null;
        this.lineChart = null;
    }

    getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            text: isDark ? '#94a3b8' : '#64748b',
            grid: isDark ? '#334155' : '#e2e8f0',
            tooltipBg: isDark ? '#1e293b' : '#ffffff',
            tooltipBorder: isDark ? '#334155' : '#cbd5e1',
            tooltipText: isDark ? '#f8fafc' : '#0f172a'
        };
    }

    /**
     * Initializes all charts with empty data or initial data
     */
    initCharts(pieCanvas, barCanvas, lineCanvas, transactions) {
        if (!pieCanvas || !barCanvas || !lineCanvas) return;

        const colors = this.getThemeColors();

        // 1. Pie Chart: Expense breakdown
        this.pieChart = new Chart(pieCanvas, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', 
                        '#9966ff', '#ff9f40', '#475569', '#14b8a6', 
                        '#ec4899', '#8b5cf6', '#3b82f6', '#f59e0b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: colors.text,
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: colors.tooltipBg,
                        borderColor: colors.tooltipBorder,
                        borderWidth: 1,
                        titleColor: colors.tooltipText,
                        bodyColor: colors.tooltipText,
                        padding: 10
                    }
                },
                cutout: '70%'
            }
        });

        // 2. Bar Chart: Monthly Income vs Expenses (shows last 6 months)
        this.barChart = new Chart(barCanvas, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Income',
                        data: [],
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    },
                    {
                        label: 'Expenses',
                        data: [],
                        backgroundColor: '#ef4444',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.text,
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: colors.tooltipBg,
                        borderColor: colors.tooltipBorder,
                        borderWidth: 1,
                        titleColor: colors.tooltipText,
                        bodyColor: colors.tooltipText,
                        padding: 10
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: colors.text, font: { family: 'Inter' } }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.text, font: { family: 'Inter' } }
                    }
                }
            }
        });

        // 3. Line Chart: Spending Trend (days of the current month)
        this.lineChart = new Chart(lineCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Daily Spending',
                    data: [],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.tooltipBg,
                        borderColor: colors.tooltipBorder,
                        borderWidth: 1,
                        titleColor: colors.tooltipText,
                        bodyColor: colors.tooltipText,
                        padding: 10
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: colors.text, font: { family: 'Inter' } }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.text, font: { family: 'Inter' } }
                    }
                }
            }
        });

        this.updateCharts(transactions);
    }

    /**
     * Re-applies theme styles when Theme toggles
     */
    updateThemeStyles() {
        const colors = this.getThemeColors();

        [this.pieChart, this.barChart, this.lineChart].forEach(chart => {
            if (!chart) return;
            if (chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = colors.text;
            }
            if (chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
                chart.options.plugins.tooltip.borderColor = colors.tooltipBorder;
                chart.options.plugins.tooltip.titleColor = colors.tooltipText;
                chart.options.plugins.tooltip.bodyColor = colors.tooltipText;
            }
            if (chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.ticks.color = colors.text;
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.ticks.color = colors.text;
                    chart.options.scales.y.grid.color = colors.grid;
                }
            }
            chart.update();
        });
    }

    /**
     * Refreshes chart datasets based on transaction state
     */
    updateCharts(transactions) {
        if (!this.pieChart || !this.barChart || !this.lineChart) return;

        // 1. Update Pie Chart (Expense Breakdown)
        const expenseCategories = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            expenseCategories[t.category] = (expenseCategories[t.category] || 0) + parseFloat(t.amount);
        });

        this.pieChart.data.labels = Object.keys(expenseCategories);
        this.pieChart.data.datasets[0].data = Object.values(expenseCategories);
        this.pieChart.update();

        // 2. Update Bar Chart (Monthly Income vs Expenses - past 6 months)
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            last6Months.push({
                label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                income: 0,
                expenses: 0
            });
        }

        transactions.forEach(t => {
            const tDate = new Date(t.date);
            const tYear = tDate.getFullYear();
            const tMonth = tDate.getMonth();

            const monthData = last6Months.find(m => m.year === tYear && m.month === tMonth);
            if (monthData) {
                const amt = parseFloat(t.amount) || 0;
                if (t.type === 'income') {
                    monthData.income += amt;
                } else {
                    monthData.expenses += amt;
                }
            }
        });

        this.barChart.data.labels = last6Months.map(m => m.label);
        this.barChart.data.datasets[0].data = last6Months.map(m => m.income);
        this.barChart.data.datasets[1].data = last6Months.map(m => m.expenses);
        this.barChart.update();

        // 3. Update Line Chart (Daily Spending in Current Month)
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const dailySpending = Array(daysInMonth).fill(0);
        const dayLabels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        transactions.forEach(t => {
            const tDate = new Date(t.date);
            if (tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth && t.type === 'expense') {
                const day = tDate.getDate();
                dailySpending[day - 1] += parseFloat(t.amount) || 0;
            }
        });

        this.lineChart.data.labels = dayLabels.map(d => `Day ${d}`);
        this.lineChart.data.datasets[0].data = dailySpending;
        this.lineChart.update();
    }
}
window.ChartsManager = ChartsManager;
