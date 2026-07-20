/**
 * Statistics Module
 * Computes calculations and scores for the dashboard, segmented by user accounts and categories.
 */

class StatisticsManager {
    static calculateStats(transactions, accounts, budgets, subscriptions) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);

        const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfPrevMonth = new Date(currentYear, currentMonth, 0);

        // Account balances calculations
        const accountBalances = {};
        accounts.forEach(acc => {
            accountBalances[acc.id] = {
                name: acc.name,
                type: acc.type,
                balance: 0 // starting from 0, transactions will build it up
            };
        });

        let totalIncome = 0;
        let totalExpenses = 0;
        let largestExpense = 0;
        let largestIncome = 0;
        let expenseSum = 0;
        let expenseCount = 0;

        let currentMonthIncome = 0;
        let currentMonthExpense = 0;

        let prevMonthIncome = 0;
        let prevMonthExpense = 0;

        const categorySpending = {};
        const categoryFrequency = {};

        transactions.forEach(t => {
            const amount = parseFloat(t.amount) || 0;
            const tDate = new Date(t.date);
            const accId = t.accountId || 'acc_cash';

            if (t.type === 'income') {
                totalIncome += amount;
                if (amount > largestIncome) largestIncome = amount;

                if (accountBalances[accId]) {
                    accountBalances[accId].balance += amount;
                }

                if (tDate >= startOfCurrentMonth && tDate <= endOfCurrentMonth) {
                    currentMonthIncome += amount;
                } else if (tDate >= startOfPrevMonth && tDate <= endOfPrevMonth) {
                    prevMonthIncome += amount;
                }
            } else if (t.type === 'expense') {
                totalExpenses += amount;
                expenseSum += amount;
                expenseCount++;
                if (amount > largestExpense) largestExpense = amount;

                if (accountBalances[accId]) {
                    accountBalances[accId].balance -= amount;
                }

                categoryFrequency[t.category] = (categoryFrequency[t.category] || 0) + 1;
                categorySpending[t.category] = (categorySpending[t.category] || 0) + amount;

                if (tDate >= startOfCurrentMonth && tDate <= endOfCurrentMonth) {
                    currentMonthExpense += amount;
                } else if (tDate >= startOfPrevMonth && tDate <= endOfPrevMonth) {
                    prevMonthExpense += amount;
                }
            }
        });

        const currentBalance = totalIncome - totalExpenses;
        const totalSavings = currentBalance > 0 ? currentBalance : 0;
        const savingsPercentage = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;
        const averageExpense = expenseCount > 0 ? (expenseSum / expenseCount) : 0;

        let mostUsedCategory = 'N/A';
        let maxFreq = 0;
        for (const [cat, freq] of Object.entries(categoryFrequency)) {
            if (freq > maxFreq) {
                maxFreq = freq;
                mostUsedCategory = cat;
            }
        }

        const daysPassed = now.getDate();
        const averageDailyExpense = currentMonthExpense / daysPassed;
        const currentMonthSavings = currentMonthIncome - currentMonthExpense;

        // Health Score
        let healthScore = 0;
        const monthlySavingsRate = currentMonthIncome > 0 ? (currentMonthSavings / currentMonthIncome) : 0;
        if (monthlySavingsRate >= 0.3) healthScore += 40;
        else if (monthlySavingsRate > 0) healthScore += Math.round(monthlySavingsRate * 133);

        // Budget Score (against category budgets)
        let totalBudgetLimit = 0;
        let totalBudgetUsage = 0;
        Object.entries(budgets).forEach(([cat, limit]) => {
            totalBudgetLimit += limit;
            totalBudgetUsage += (categorySpending[cat] || 0);
        });

        if (totalBudgetLimit > 0) {
            const budgetRatio = totalBudgetUsage / totalBudgetLimit;
            if (budgetRatio <= 0.8) healthScore += 40;
            else if (budgetRatio <= 1.0) healthScore += Math.round((1.0 - (budgetRatio - 0.8) / 0.2) * 40);
        } else {
            const spendRatio = currentMonthIncome > 0 ? (currentMonthExpense / currentMonthIncome) : 0.5;
            if (spendRatio <= 0.5) healthScore += 40;
            else if (spendRatio <= 1.0) healthScore += Math.round((1.0 - (spendRatio - 0.5) / 0.5) * 40);
        }

        if (currentBalance > 0) healthScore += 20;
        else if (currentBalance === 0) healthScore += 10;

        healthScore = Math.max(0, Math.min(100, healthScore));

        // Prev month comparison
        const incomeDiff = currentMonthIncome - prevMonthIncome;
        const incomeChangePct = prevMonthIncome > 0 ? (incomeDiff / prevMonthIncome) * 100 : 0;

        const expenseDiff = currentMonthExpense - prevMonthExpense;
        const expenseChangePct = prevMonthExpense > 0 ? (expenseDiff / prevMonthExpense) * 100 : 0;

        // Category Budgets Progress
        const budgetProgressList = [];
        Object.entries(budgets).forEach(([cat, limit]) => {
            if (limit > 0) {
                const spent = categorySpending[cat] || 0;
                budgetProgressList.push({
                    category: cat,
                    limit,
                    spent,
                    percentage: Math.min(100, Math.round((spent / limit) * 100))
                });
            }
        });

        // Subscriptions total monthly calculations
        let totalMonthlySubscriptions = 0;
        subscriptions.forEach(s => {
            const amt = parseFloat(s.amount) || 0;
            totalMonthlySubscriptions += amt;
        });

        return {
            currentBalance,
            totalIncome,
            totalExpenses,
            totalSavings,
            savingsPercentage,
            transactionCount: transactions.length,
            averageExpense,
            largestExpense,
            largestIncome,
            mostUsedCategory,
            averageDailyExpense,
            currentMonthExpense,
            currentMonthIncome,
            currentMonthSavings,
            healthScore,
            accountBalances,
            budgetProgressList,
            totalMonthlySubscriptions,
            comparison: {
                incomeChangePct,
                expenseChangePct,
                incomeDiff,
                expenseDiff
            }
        };
    }
}
window.StatisticsManager = StatisticsManager;
