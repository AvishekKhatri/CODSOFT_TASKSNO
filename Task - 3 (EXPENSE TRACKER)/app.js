/**
 * Main Application Module for Spendora
 * Orchestrates the application bootstrap and handles all data state sync using Firestore & Auth hooks.
 */

class ExpenseTrackerApp {
    constructor() {
        this.currentUser = null;
        this.transactions = [];
        this.accounts = [];
        this.budgets = {};
        this.subscriptions = [];
        this.budgetLimit = 0;
        this.activeAccountId = 'all'; // Filter state: 'all' or specific account UID

        // Listeners unsubscribers
        this.unsubs = {
            transactions: null,
            accounts: null,
            budgets: null,
            subscriptions: null,
            profile: null
        };

        this.ui = null;
        this.charts = null;
    }

    init(user) {
        this.currentUser = user;

        // Init theme switcher
        ThemeManager.init();

        // Init Chart Manager
        this.charts = new ChartsManager();

        // Init UI Manager
        this.ui = new UIManager(this);
        this.ui.init();

        // Set User Profile UI text
        this.ui.dom.userEmailDisplay.textContent = user.email;
        this.ui.dom.usernameDisplay.textContent = user.email.split('@')[0];
        this.ui.dom.userAvatarInitials.textContent = user.email.substring(0, 2).toUpperCase();

        // Retrieve dynamic User Profile (Full Name) from Firestore
        FirestoreManager.getUserProfile(user.uid).then(profile => {
            if (profile && profile.fullName) {
                this.ui.dom.usernameDisplay.textContent = profile.fullName;
                const initials = profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                this.ui.dom.userAvatarInitials.textContent = initials || 'U';
            }
        });

        // Bootstrap charts
        const pieCtx = document.getElementById('chart-pie').getContext('2d');
        const barCtx = document.getElementById('chart-bar').getContext('2d');
        const lineCtx = document.getElementById('chart-line').getContext('2d');
        this.charts.initCharts(pieCtx, barCtx, lineCtx, []);

        // Start real-time listeners for all data subcollections
        this.startRealTimeSync();

        // Bind high-level action hooks (Export, Import)
        this.bindGlobalActions();
    }

    startRealTimeSync() {
        const uid = this.currentUser.uid;

        // 1. Sync User settings
        this.unsubs.profile = db.collection('users').doc(uid).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                this.budgetLimit = parseFloat(data.budgetLimit) || 0;
            } else {
                this.budgetLimit = 0;
            }
            this.filterAndRender();
        });

        // 2. Sync Accounts
        this.unsubs.accounts = FirestoreManager.subscribeToSubcollection(uid, 'accounts', (items) => {
            this.accounts = items;
            // Set first account as default if not defined
            if (this.accounts.length > 0 && this.activeAccountId === 'all') {
                this.activeAccountId = this.accounts[0].id;
            }
            this.filterAndRender();
        });

        // 3. Sync Budgets
        this.unsubs.budgets = FirestoreManager.subscribeToSubcollection(uid, 'budgets', (items) => {
            const budgetMap = {};
            items.forEach(item => {
                budgetMap[item.id] = item.limit || 0;
            });
            this.budgets = budgetMap;
            this.filterAndRender();
        });

        // 4. Sync Subscriptions
        this.unsubs.subscriptions = FirestoreManager.subscribeToSubcollection(uid, 'subscriptions', (items) => {
            this.subscriptions = items;
            this.filterAndRender();
        });

        // 5. Sync Transactions
        this.unsubs.transactions = FirestoreManager.subscribeToSubcollection(uid, 'transactions', (items) => {
            this.transactions = items;
            this.filterAndRender();
        });
    }

    stopRealTimeSync() {
        // Unsubscribe all active snapshots
        Object.keys(this.unsubs).forEach(key => {
            if (this.unsubs[key]) {
                this.unsubs[key]();
                this.unsubs[key] = null;
            }
        });
    }

    reloadAll() {
        this.filterAndRender();
    }

    setActiveAccount(accountId) {
        this.activeAccountId = accountId;
        this.filterAndRender();
    }

    filterAndRender() {
        if (!this.ui) return;

        const filters = this.ui.activeFilters;
        let filtered = [...this.transactions];

        // 0. Account Isolation Filter (if activeAccountId selected)
        if (this.activeAccountId && this.activeAccountId !== 'all') {
            filtered = filtered.filter(t => t.accountId === this.activeAccountId);
        }

        // 1. Search Query Filter
        if (filters.search) {
            filtered = filtered.filter(t => 
                (t.title && t.title.toLowerCase().includes(filters.search)) ||
                (t.category && t.category.toLowerCase().includes(filters.search)) ||
                (t.notes && t.notes.toLowerCase().includes(filters.search))
            );
        }

        // 2. Type Filter
        if (filters.type !== 'all') {
            filtered = filtered.filter(t => t.type === filters.type);
        }

        // 3. Category Filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(t => t.category.toLowerCase() === filters.category);
        }

        // 4. Timeframe Filter
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        if (filters.timeframe === 'month') {
            filtered = filtered.filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });
        } else if (filters.timeframe === 'week') {
            filtered = filtered.filter(t => {
                const d = new Date(t.date);
                return d >= startOfWeek;
            });
        } else if (filters.timeframe === 'last_month') {
            filtered = filtered.filter(t => {
                const d = new Date(t.date);
                const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
            });
        } else if (filters.timeframe === 'custom' && filters.customStart && filters.customEnd) {
            const start = new Date(filters.customStart);
            const end = new Date(filters.customEnd);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(t => {
                const d = new Date(t.date);
                return d >= start && d <= end;
            });
        }

        // 5. Sorting
        if (filters.sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (filters.sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (filters.sortBy === 'highest') {
            filtered.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        } else if (filters.sortBy === 'lowest') {
            filtered.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
        } else if (filters.sortBy === 'category') {
            filtered.sort((a, b) => a.category.localeCompare(b.category));
        } else if (filters.sortBy === 'alphabetical') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        // Compute dashboard analytics based on FILTERED transactions
        const stats = StatisticsManager.calculateStats(
            filtered,
            this.accounts,
            this.budgets,
            this.subscriptions
        );

        // Update accounts balances dynamically based on ALL transactions for accurate ledger matching
        const dynamicAccountsStats = StatisticsManager.calculateStats(
            this.transactions,
            this.accounts,
            this.budgets,
            this.subscriptions
        );

        const dAccounts = this.accounts.map(acc => {
            const balStruct = dynamicAccountsStats.accountBalances[acc.id];
            return {
                ...acc,
                balance: balStruct ? balStruct.balance : 0
            };
        });

        // Render Sidebar accounts
        this.ui.renderAccounts(dAccounts, this.activeAccountId);

        // Render Dashboard numbers
        this.ui.renderDashboard(stats, this.budgetLimit);

        // Render filtered transactions list
        this.ui.renderTransactions(filtered);

        // Update charts datasets
        this.charts.updateCharts(filtered);
    }

    async saveTransaction(data, isEdit) {
        const uid = this.currentUser.uid;
        let result;
        if (isEdit) {
            const docId = data.id;
            const updatedData = { ...data };
            delete updatedData.id;
            result = await FirestoreManager.updateTransaction(uid, docId, updatedData);
            if (result.success) this.ui.showToast(`Transaction updated successfully!`, 'success');
        } else {
            const newData = { ...data };
            delete newData.id;
            result = await FirestoreManager.addTransaction(uid, newData);
            if (result.success) this.ui.showToast(`Transaction added successfully!`, 'success');
        }

        if (!result.success) {
            this.ui.showToast(`Failed: ${result.error.message}`, 'danger');
        }
    }

    async deleteTransaction(id) {
        const uid = this.currentUser.uid;
        const result = await FirestoreManager.deleteTransaction(uid, id);
        if (result.success) {
            this.ui.showToast(`Transaction deleted successfully!`, 'danger');
        } else {
            this.ui.showToast(`Failed to delete transaction`, 'danger');
        }
    }

    async toggleFavorite(id) {
        const tx = this.transactions.find(t => t.id === id);
        if (tx) {
            const uid = this.currentUser.uid;
            const res = await FirestoreManager.updateTransaction(uid, id, {
                isFavorite: !tx.isFavorite
            });
            if (res.success) {
                this.ui.showToast(!tx.isFavorite ? `Added to favorites!` : `Removed from favorites`, 'info');
            }
        }
    }

    // --- Auxiliary Data Submissions ---
    async saveBudgetLimit(limit) {
        const uid = this.currentUser.uid;
        const res = await FirestoreManager.saveUserProfile(uid, {
            budgetLimit: limit
        });
        if (res.success) {
            this.ui.showToast('Global budget limit saved!', 'success');
        }
    }

    async saveCategoryBudget(category, limit) {
        const uid = this.currentUser.uid;
        const res = await FirestoreManager.setCategoryBudget(uid, category, limit);
        if (res.success) {
            this.ui.showToast(`Target for ${category} updated!`, 'success');
        }
    }

    async addAccount(name, type) {
        const uid = this.currentUser.uid;
        const res = await FirestoreManager.addAccount(uid, { name, type, balance: 0 });
        if (res.success) {
            this.ui.showToast(`Account "${name}" created!`, 'success');
        }
    }

    async addSubscription(name, amount, date) {
        const uid = this.currentUser.uid;
        const res = await FirestoreManager.addSubscription(uid, { name, amount, nextBillingDate: date });
        if (res.success) {
            this.ui.showToast(`Recurring bill added!`, 'success');
        }
    }

    async deleteSubscription(id) {
        const uid = this.currentUser.uid;
        const res = await FirestoreManager.deleteSubscription(uid, id);
        if (res.success) {
            this.ui.showToast('Subscription removed', 'info');
        }
    }

    bindGlobalActions() {
        // Export CSV
        document.getElementById('btn-export-csv').addEventListener('click', () => {
            // Only export transactions matching current active account if selected
            let txToExport = [...this.transactions];
            if (this.activeAccountId !== 'all') {
                txToExport = txToExport.filter(t => t.accountId === this.activeAccountId);
            }

            const csv = StorageManager.exportToCSV(txToExport);
            if (!csv) {
                this.ui.showToast('No transactions to export', 'warning');
                return;
            }
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `Spendora_Report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.ui.showToast('Data exported to CSV successfully!', 'success');
        });

        // Export PDF
        document.getElementById('btn-export-pdf').addEventListener('click', () => {
            window.print();
            this.ui.showToast('Data generated for PDF Print successfully!', 'success');
        });

        // Import CSV
        const fileInput = document.getElementById('csv-file-input');
        document.getElementById('btn-import-csv').addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (evt) => {
                const text = evt.target.result;
                const parseRes = StorageManager.parseCSV(text);
                if (parseRes.success) {
                    const uid = this.currentUser.uid;
                    let added = 0;
                    for (const tx of parseRes.transactions) {
                        // Ensure accountId matches one of our active accounts, or write it to current selected
                        const cleanTx = { ...tx };
                        if (!cleanTx.accountId) {
                            cleanTx.accountId = this.activeAccountId !== 'all' ? this.activeAccountId : 'acc_cash';
                        }
                        await FirestoreManager.addTransaction(uid, cleanTx);
                        added++;
                    }
                    this.ui.showToast(`Imported ${added} transactions successfully!`, 'success');
                } else {
                    this.ui.showToast(`Import failed: ${parseRes.error}`, 'danger');
                }
                fileInput.value = '';
            };
            reader.readAsText(file);
        });
    }
}

// Bootstrap main app module
document.addEventListener('DOMContentLoaded', () => {
    const app = new ExpenseTrackerApp();
    
    // Auth gate checking
    auth.onAuthStateChanged(user => {
        if (user) {
            app.init(user);
        } else {
            // Terminate listeners
            app.stopRealTimeSync();
            window.location.href = 'login.html';
        }
    });
});
