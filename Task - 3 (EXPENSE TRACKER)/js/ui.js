/**
 * UI Manager Module
 * Coordinates DOM rendering, toast notifications, modals, input styles, and filter triggers.
 */

class UIManager {
    constructor(appInstance) {
        this.app = appInstance;
        this.activeFilters = {
            type: 'all',
            category: 'all',
            timeframe: 'all',
            customStart: '',
            customEnd: '',
            sortBy: 'newest',
            search: ''
        };

        // Cache elements
        this.dom = {
            // Stats
            valBalance: document.getElementById('val-balance'),
            valIncome: document.getElementById('val-income'),
            valExpense: document.getElementById('val-expense'),
            valSavings: document.getElementById('val-savings'),
            
            // Trend Indicators
            trendBalance: document.getElementById('trend-balance'),
            trendIncome: document.getElementById('trend-income'),
            trendExpense: document.getElementById('trend-expense'),
            trendSavings: document.getElementById('trend-savings'),

            // Insights
            healthPercent: document.getElementById('val-health-score'),
            healthStatus: document.getElementById('val-health-status'),
            healthCircle: document.getElementById('health-score-fill'),
            valAvgExpense: document.getElementById('val-avg-expense'),
            valLargestExpense: document.getElementById('val-largest-expense'),
            valLargestIncome: document.getElementById('val-largest-income'),
            valDailyAvg: document.getElementById('val-daily-avg'),
            valMostUsedCat: document.getElementById('val-most-used-cat'),
            valSavingsPct: document.getElementById('val-savings-pct'),

            // Lists & Screens
            transactionList: document.getElementById('transaction-list'),
            emptyState: document.getElementById('empty-state'),
            accountsList: document.getElementById('sidebar-accounts-list'),
            budgetProgressList: document.getElementById('budget-progress-list'),
            subscriptionsList: document.getElementById('subscriptions-list'),
            valSubMonthlyTotal: document.getElementById('val-sub-monthly-total'),
            
            // Search & Filters
            searchInput: document.getElementById('search-input'),
            filterToggleBtn: document.getElementById('filter-toggle-btn'),
            filterFlyout: document.getElementById('filter-flyout'),
            filterType: document.getElementById('filter-type'),
            filterCategory: document.getElementById('filter-category'),
            filterTimeframe: document.getElementById('filter-timeframe'),
            filterCustomRange: document.getElementById('filter-custom-range'),
            filterStart: document.getElementById('filter-start'),
            filterEnd: document.getElementById('filter-end'),
            filterSortBy: document.getElementById('filter-sort-by'),
            btnResetFilters: document.getElementById('btn-reset-filters'),
            btnApplyFilters: document.getElementById('btn-apply-filters'),
            activeFilterBadgeCount: document.getElementById('active-filter-badge-count'),

            // Modals
            modalTx: document.getElementById('modal-transaction'),
            modalTxTitle: document.getElementById('modal-tx-title'),
            formTx: document.getElementById('form-transaction'),
            txId: document.getElementById('tx-id'),
            txTitle: document.getElementById('tx-title'),
            txAmount: document.getElementById('tx-amount'),
            txType: document.getElementById('tx-type'),
            txCategory: document.getElementById('tx-category'),
            txDate: document.getElementById('tx-date'),
            txNotes: document.getElementById('tx-notes'),
            txFavorite: document.getElementById('tx-favorite'),
            txRecurring: document.getElementById('tx-recurring'),
            btnSaveTx: document.getElementById('btn-save-transaction'),

            modalDelete: document.getElementById('modal-delete'),
            btnConfirmDelete: document.getElementById('btn-confirm-delete'),
            
            modalBudget: document.getElementById('modal-budget'),
            formBudget: document.getElementById('form-budget'),
            budgetLimitVal: document.getElementById('budget-limit-val'),

            modalCategoryBudget: document.getElementById('modal-category-budget'),
            formCategoryBudget: document.getElementById('form-category-budget'),
            budgetCatSelect: document.getElementById('budget-cat-select'),
            budgetCatLimit: document.getElementById('budget-cat-limit'),

            modalAccount: document.getElementById('modal-account'),
            formAccount: document.getElementById('form-account'),
            accountName: document.getElementById('account-name'),
            accountType: document.getElementById('account-type'),

            modalSubscription: document.getElementById('modal-subscription'),
            formSubscription: document.getElementById('form-subscription'),
            subName: document.getElementById('sub-name'),
            subAmount: document.getElementById('sub-amount'),
            subDate: document.getElementById('sub-date'),

            // Toast Container
            toastContainer: document.getElementById('toast-container'),

            // Sidebar & Nav
            sidebar: document.getElementById('app-sidebar'),
            sidebarToggle: document.getElementById('mobile-nav-toggle'),
            currencySelect: document.getElementById('currency-select'),
            alertContainer: document.getElementById('alert-container'),
            usernameDisplay: document.getElementById('username-display'),
            userEmailDisplay: document.getElementById('user-email-display'),
            userAvatarInitials: document.getElementById('user-avatar-initials'),
            btnLogout: document.getElementById('btn-logout'),
            userProfileChip: document.getElementById('user-profile-chip')
        };

        this.currencies = {
            USD: { symbol: '$', name: 'US Dollar' },
            EUR: { symbol: '€', name: 'Euro' },
            GBP: { symbol: '£', name: 'British Pound' },
            INR: { symbol: '₹', name: 'Indian Rupee' },
            JPY: { symbol: '¥', name: 'Japanese Yen' },
            AUD: { symbol: 'A$', name: 'Australian Dollar' },
            CAD: { symbol: 'C$', name: 'Canadian Dollar' },
            CHF: { symbol: 'CHF', name: 'Swiss Franc' },
            CNY: { symbol: '¥', name: 'Chinese Yuan' },
            HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
            NZD: { symbol: 'NZ$', name: 'New Zealand Dollar' },
            SEK: { symbol: 'kr', name: 'Swedish Krona' },
            KRW: { symbol: '₩', name: 'South Korean Won' },
            SGD: { symbol: 'S$', name: 'Singapore Dollar' },
            NOK: { symbol: 'kr', name: 'Norwegian Krone' },
            MXN: { symbol: '$', name: 'Mexican Peso' },
            RUB: { symbol: '₽', name: 'Russian Ruble' },
            ZAR: { symbol: 'R', name: 'South African Rand' },
            TRY: { symbol: '₺', name: 'Turkish Lira' },
            BRL: { symbol: 'R$', name: 'Brazilian Real' },
            TWD: { symbol: 'NT$', name: 'New Taiwan Dollar' },
            DKK: { symbol: 'kr', name: 'Danish Krone' },
            PLN: { symbol: 'zł', name: 'Polish Zloty' },
            THB: { symbol: '฿', name: 'Thai Baht' },
            IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
            HUF: { symbol: 'Ft', name: 'Hungarian Forint' },
            CZK: { symbol: 'Kč', name: 'Czech Koruna' },
            ILS: { symbol: '₪', name: 'Israeli New Shekel' },
            CLP: { symbol: '$', name: 'Chilean Peso' },
            PHP: { symbol: '₱', name: 'Philippine Peso' },
            AED: { symbol: 'د.إ', name: 'UAE Dirham' },
            COP: { symbol: '$', name: 'Colombian Peso' },
            SAR: { symbol: 'ر.س', name: 'Saudi Riyal' },
            MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
            RON: { symbol: 'lei', name: 'Romanian Leu' },
            ARS: { symbol: '$', name: 'Argentine Peso' },
            VND: { symbol: '₫', name: 'Vietnamese Dong' },
            PEN: { symbol: 'S/.', name: 'Peruvian Sol' },
            UAH: { symbol: '₴', name: 'Ukrainian Hryvnia' },
            KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar' },
            QAR: { symbol: 'ر.ق', name: 'Qatari Riyal' },
            PKR: { symbol: '₨', name: 'Pakistani Rupee' },
            EGP: { symbol: 'E£', name: 'Egyptian Pound' },
            BDT: { symbol: '৳', name: 'Bangladeshi Taka' },
            NGN: { symbol: '₦', name: 'Nigerian Naira' },
            DZD: { symbol: 'د.ج', name: 'Algerian Dinar' },
            MAD: { symbol: 'د.م.', name: 'Moroccan Dirham' },
            LBP: { symbol: 'ل.ل', name: 'Lebanese Pound' },
            JOD: { symbol: 'د.ا', name: 'Jordanian Dinar' },
            OMR: { symbol: 'ر.ع.', name: 'Omani Rial' },
            BHD: { symbol: 'د.ب', name: 'Bahraini Dinar' },
            BND: { symbol: 'B$', name: 'Brunei Dollar' }
        };
    }

    init() {
        this.setupEventListeners();
        this.populateCurrencyOptions();
        this.populateCategoryOptions();
    }

    getCurrencySymbol() {
        const selected = StorageManager.getCurrency();
        return (this.currencies[selected] && this.currencies[selected].symbol) || '$';
    }

    formatMoney(amount) {
        const symbol = this.getCurrencySymbol();
        return `${symbol}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    populateCurrencyOptions() {
        const select = this.dom.currencySelect;
        select.innerHTML = '';
        const saved = StorageManager.getCurrency();
        
        Object.keys(this.currencies).sort().forEach(code => {
            const cur = this.currencies[code];
            const opt = document.createElement('option');
            opt.value = code;
            opt.textContent = `${code} (${cur.symbol}) - ${cur.name}`;
            if (code === saved) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });
    }

    populateCategoryOptions() {
        const type = this.dom.txType.value;
        const select = this.dom.txCategory;
        select.innerHTML = '';

        const categories = type === 'income' 
            ? ['Salary', 'Freelance', 'Business', 'Bonus', 'Investment', 'Gift', 'Other']
            : ['Food', 'Transportation', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Travel', 'Rent', 'Investment', 'Other'];

        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.toLowerCase();
            opt.textContent = cat;
            select.appendChild(opt);
        });

        // Also populate filters category dropdown once
        const filterCat = this.dom.filterCategory;
        if (filterCat && filterCat.children.length <= 1) {
            const allCats = new Set([
                'Salary', 'Freelance', 'Business', 'Bonus', 'Investment', 'Gift',
                'Food', 'Transportation', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Travel', 'Rent', 'Other'
            ]);
            allCats.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.toLowerCase();
                opt.textContent = cat;
                filterCat.appendChild(opt);
            });
        }
    }

    animateValue(element, start, end, duration = 800, prefix = '') {
        if (!element) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = progress * (end - start) + start;
            element.textContent = (end < 0 ? '-' : '') + prefix + Math.abs(currentVal).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = (end < 0 ? '-' : '') + prefix + Math.abs(end).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        };
        window.requestAnimationFrame(step);
    }

    renderDashboard(stats, budgetLimit) {
        const symbol = this.getCurrencySymbol();
        
        // Dynamic Counter Animations
        this.animateValue(this.dom.valBalance, 0, stats.currentBalance, 500, symbol);
        this.animateValue(this.dom.valIncome, 0, stats.totalIncome, 500, symbol);
        this.animateValue(this.dom.valExpense, 0, stats.totalExpenses, 500, symbol);
        this.animateValue(this.dom.valSavings, 0, stats.totalSavings, 500, symbol);
        
        // Render Trend Indicators
        this.renderTrends(stats.comparison);

        // Insights Panel Update
        this.renderHealthScore(stats.healthScore);
        
        this.dom.valAvgExpense.textContent = this.formatMoney(stats.averageExpense);
        this.dom.valLargestExpense.textContent = this.formatMoney(stats.largestExpense);
        this.dom.valLargestIncome.textContent = this.formatMoney(stats.largestIncome);
        this.dom.valDailyAvg.textContent = this.formatMoney(stats.averageDailyExpense);
        this.dom.valMostUsedCat.textContent = stats.mostUsedCategory.charAt(0).toUpperCase() + stats.mostUsedCategory.slice(1);
        this.dom.valSavingsPct.textContent = `${stats.savingsPercentage}%`;

        // Render Alerts (Budget warnings)
        this.renderBudgetWarnings(stats.currentMonthExpense, budgetLimit);

        // Render YNAB Budgets List
        this.renderBudgetProgress(stats.budgetProgressList);

        // Render Subscriptions
        this.renderSubscriptions(this.app.subscriptions, stats.totalMonthlySubscriptions);
    }

    renderTrends(comparison) {
        this.setTrendStyle(this.dom.trendBalance, comparison.incomeChangePct - comparison.expenseChangePct);
        this.setTrendStyle(this.dom.trendIncome, comparison.incomeChangePct);
        this.setTrendStyle(this.dom.trendExpense, -comparison.expenseChangePct);
        this.setTrendStyle(this.dom.trendSavings, comparison.incomeChangePct - comparison.expenseChangePct);
    }

    setTrendStyle(element, pct) {
        if (!element) return;
        element.className = 'trend-indicator';
        if (pct > 0.1) {
            element.classList.add('trend-up');
            element.innerHTML = `<i data-lucide="trending-up"></i> +${pct.toFixed(0)}%`;
        } else if (pct < -0.1) {
            element.classList.add('trend-down');
            element.innerHTML = `<i data-lucide="trending-down"></i> ${pct.toFixed(0)}%`;
        } else {
            element.classList.add('trend-neutral');
            element.innerHTML = `<i data-lucide="minus"></i> 0%`;
        }
        lucide.createIcons();
    }

    renderHealthScore(score) {
        this.dom.healthPercent.textContent = score;
        let status = 'Fair';
        let strokeColor = '#f59e0b';

        if (score >= 80) {
            status = 'Excellent';
            strokeColor = '#10b981';
        } else if (score >= 50) {
            status = 'Good';
            strokeColor = '#6366f1';
        } else if (score < 30) {
            status = 'Needs Attention';
            strokeColor = '#ef4444';
        }

        this.dom.healthStatus.textContent = status;
        this.dom.healthCircle.style.stroke = strokeColor;

        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;
        this.dom.healthCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        this.dom.healthCircle.style.strokeDashoffset = offset;
    }

    renderBudgetWarnings(currentSpend, limit) {
        this.dom.alertContainer.innerHTML = '';
        if (limit <= 0) return;

        const ratio = currentSpend / limit;
        if (ratio >= 1.0) {
            this.showAlertBanner(`Danger: You have exceeded your monthly budget limit of ${this.formatMoney(limit)} by ${this.formatMoney(currentSpend - limit)}!`, 'danger');
        } else if (ratio >= 0.85) {
            this.showAlertBanner(`Warning: You have spent ${Math.round(ratio * 100)}% of your monthly budget limit of ${this.formatMoney(limit)}.`, 'warning');
        }
    }

    showAlertBanner(message, type) {
        const banner = document.createElement('div');
        banner.className = `alert-banner ${type}`;
        banner.innerHTML = `
            <div class="alert-content">
                <i data-lucide="${type === 'danger' ? 'alert-octagon' : 'alert-triangle'}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close"><i data-lucide="x"></i></button>
        `;
        banner.querySelector('.alert-close').addEventListener('click', () => banner.remove());
        this.dom.alertContainer.appendChild(banner);
        lucide.createIcons();
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconName = 'check-circle';
        if (type === 'danger') iconName = 'alert-octagon';
        if (type === 'warning') iconName = 'alert-triangle';
        if (type === 'info') iconName = 'info';

        toast.innerHTML = `
            <span class="toast-icon ${type}"><i data-lucide="${iconName}"></i></span>
            <span>${message}</span>
        `;
        this.dom.toastContainer.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    renderTransactions(transactions) {
        const container = this.dom.transactionList;
        container.innerHTML = '';

        if (transactions.length === 0) {
            this.dom.emptyState.style.display = 'flex';
            container.style.display = 'none';
            return;
        }

        this.dom.emptyState.style.display = 'none';
        container.style.display = 'flex';

        transactions.forEach(t => {
            const card = document.createElement('div');
            card.className = 'transaction-card animate-fade-in';
            card.dataset.id = t.id;

            const categoryClass = `category-${t.category.toLowerCase().replace(/\s+/g, '-')}`;
            const amountFormatted = (t.type === 'income' ? '+' : '-') + this.formatMoney(t.amount);

            card.innerHTML = `
                <div class="transaction-icon-box ${categoryClass}">
                    <i data-lucide="${this.getCategoryIcon(t.category)}"></i>
                </div>
                <div class="transaction-info-box">
                    <div class="transaction-title-line">
                        <span class="transaction-title">${this.escapeHTML(t.title)}</span>
                        <i data-lucide="star" class="favorite-star ${t.isFavorite ? 'active' : ''}" style="${t.isFavorite ? 'fill: #f59e0b; color: #f59e0b;' : 'color: #94a3b8;'}"></i>
                        ${t.isRecurring ? '<span class="transaction-recurring-badge">Recurring</span>' : ''}
                    </div>
                    <div class="transaction-meta">
                        <span class="category-badge ${categoryClass}">${t.category.toUpperCase()}</span>
                        <span>${t.date}</span>
                        ${t.notes ? `<span class="notes-preview" title="${this.escapeHTML(t.notes)}"><i data-lucide="file-text"></i> Notes</span>` : ''}
                    </div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${amountFormatted}
                </div>
                <div class="transaction-actions">
                    <button class="action-btn edit" title="Edit"><i data-lucide="edit-3"></i></button>
                    <button class="action-btn delete" title="Delete"><i data-lucide="trash-2"></i></button>
                </div>
            `;
            container.appendChild(card);
        });

        lucide.createIcons();
    }

    renderAccounts(accounts, activeAccountId) {
        const container = this.dom.accountsList;
        container.innerHTML = '';

        accounts.forEach(acc => {
            const activeClass = acc.id === activeAccountId ? 'active' : '';
            const balanceFormatted = this.formatMoney(acc.balance || 0);

            const chip = document.createElement('div');
            chip.className = `account-chip ${activeClass}`;
            chip.dataset.id = acc.id;

            chip.innerHTML = `
                <div class="account-chip-info">
                    <i data-lucide="${acc.type === 'credit' ? 'credit-card' : acc.type === 'bank' ? 'landmark' : 'wallet'}"></i>
                    <span class="account-chip-name">${this.escapeHTML(acc.name)}</span>
                </div>
                <span class="account-chip-balance">${balanceFormatted}</span>
            `;
            
            // Switch active account filter on click
            chip.addEventListener('click', () => {
                this.app.setActiveAccount(acc.id);
            });

            container.appendChild(chip);
        });

        lucide.createIcons();
    }

    renderBudgetProgress(budgetProgressList) {
        const container = this.dom.budgetProgressList;
        container.innerHTML = '';

        if (budgetProgressList.length === 0) {
            container.innerHTML = '<span style="font-size: 13px; color: var(--text-muted);">No budgets set. Click "Set Budget" to set category targets.</span>';
            return;
        }

        budgetProgressList.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'budget-progress-item';

            let fillClass = '';
            if (item.percentage >= 100) fillClass = 'danger';
            else if (item.percentage >= 85) fillClass = 'warning';

            itemEl.innerHTML = `
                <div class="budget-progress-header">
                    <span class="budget-progress-title">${item.category.toUpperCase()}</span>
                    <span class="budget-progress-amount">${this.formatMoney(item.spent)} / ${this.formatMoney(item.limit)} (${item.percentage}%)</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill ${fillClass}" style="width: ${item.percentage}%"></div>
                </div>
            `;
            container.appendChild(itemEl);
        });
    }

    renderSubscriptions(subscriptions, monthlyTotal) {
        this.dom.valSubMonthlyTotal.textContent = `${this.formatMoney(monthlyTotal)}/mo`;
        const container = this.dom.subscriptionsList;
        container.innerHTML = '';

        if (subscriptions.length === 0) {
            container.innerHTML = '<span style="font-size: 13px; color: var(--text-muted);">No subscriptions tracked. Click "Add Bill" to create recurring expenses.</span>';
            return;
        }

        subscriptions.forEach(s => {
            const item = document.createElement('div');
            item.className = 'subscription-item';
            item.innerHTML = `
                <div class="sub-meta">
                    <span class="sub-name">${this.escapeHTML(s.name)}</span>
                    <span class="sub-date">Next charge: ${s.nextBillingDate}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span class="sub-price">${this.formatMoney(s.amount)}</span>
                    <button class="action-btn delete-sub" data-id="${s.id}" title="Remove Recurring Bill"><i data-lucide="trash-2" style="width:16px;height:16px;"></i></button>
                </div>
            `;

            item.querySelector('.delete-sub').addEventListener('click', (e) => {
                e.stopPropagation();
                this.app.deleteSubscription(s.id);
            });

            container.appendChild(item);
        });

        lucide.createIcons();
    }

    getCategoryIcon(category) {
        const icons = {
            salary: 'banknote', freelance: 'laptop', business: 'briefcase', bonus: 'gift', investment: 'trending-up', gift: 'award',
            food: 'utensils', transportation: 'car', shopping: 'shopping-bag', bills: 'file-text', entertainment: 'tv', education: 'book-open',
            health: 'heart-pulse', travel: 'plane', rent: 'home', other: 'help-circle'
        };
        return icons[category.toLowerCase()] || 'dollar-sign';
    }

    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'\"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    setupEventListeners() {
        // Show Account details when clicking user profile card
        if (this.dom.userProfileChip) {
            this.dom.userProfileChip.style.cursor = 'pointer';
            this.dom.userProfileChip.addEventListener('click', (e) => {
                // Prevent logout button from triggering this modal open
                if (e.target.closest('#btn-logout')) return;
                
                const user = this.app.currentUser;
                if (!user) return;

                // Populate Modal Elements
                const modal = document.getElementById('modal-profile-details');
                const nameInput = document.getElementById('details-name-input');
                const emailDisplay = document.getElementById('details-email');
                const uidDisplay = document.getElementById('details-uid');
                const providerDisplay = document.getElementById('details-provider');
                const balanceDisplay = document.getElementById('details-active-balance');
                const avatarDisplay = document.getElementById('details-avatar');

                if (nameInput) nameInput.value = this.dom.usernameDisplay.textContent;
                if (emailDisplay) emailDisplay.textContent = user.email || 'N/A';
                if (uidDisplay) uidDisplay.textContent = user.uid;
                
                // Determine Provider
                if (providerDisplay) {
                    const providerId = user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'email';
                    providerDisplay.textContent = providerId.replace('.com', '');
                }

                // Show active account balance
                if (balanceDisplay) {
                    const activeAccount = this.app.accounts.find(a => a.id === this.app.activeAccountId);
                    const balanceAmount = activeAccount ? activeAccount.balance : this.app.accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
                    balanceDisplay.textContent = this.formatMoney(balanceAmount || 0);
                }

                if (avatarDisplay) avatarDisplay.textContent = this.dom.userAvatarInitials.textContent;

                this.openModal(modal);
            });

            // Bind profile name saving logic
            const saveProfileNameBtn = document.getElementById('btn-save-profile-name');
            if (saveProfileNameBtn) {
                saveProfileNameBtn.addEventListener('click', async () => {
                    const nameInput = document.getElementById('details-name-input');
                    const newName = nameInput ? nameInput.value.trim() : '';
                    if (!newName) {
                        this.showToast('Name cannot be empty', 'warning');
                        return;
                    }
                    
                    saveProfileNameBtn.disabled = true;
                    const res = await this.app.saveBudgetLimit(this.app.budgetLimit); // Force writing settings wrapper
                    // Explicitly update profile name in Firestore
                    const user = this.app.currentUser;
                    const updateRes = await FirestoreManager.saveUserProfile(user.uid, { fullName: newName });
                    saveProfileNameBtn.disabled = false;

                    if (updateRes.success) {
                        this.showToast('Profile name updated successfully!', 'success');
                        
                        // Update dynamic details avatar initials locally
                        const initials = newName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                        const avatarDisplay = document.getElementById('details-avatar');
                        if (avatarDisplay) avatarDisplay.textContent = initials || 'U';
                    } else {
                        this.showToast('Failed to update name', 'danger');
                    }
                });
            }
        }

        // Toggle Mobile Navigation
        this.dom.sidebarToggle.addEventListener('click', () => {
            this.dom.sidebar.classList.toggle('active');
        });

        // Close sidebar click outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!this.dom.sidebar.contains(e.target) && !this.dom.sidebarToggle.contains(e.target)) {
                    this.dom.sidebar.classList.remove('active');
                }
            }
        });

        // Theme Switcher Buttons
        document.getElementById('btn-theme-toggle').addEventListener('click', () => {
            const newTheme = ThemeManager.toggleTheme();
            this.app.charts.updateThemeStyles();
            this.showToast(`Theme changed to ${newTheme} mode!`, 'info');
        });

        // Currency Switcher
        this.dom.currencySelect.addEventListener('change', (e) => {
            StorageManager.saveCurrency(e.target.value);
            this.app.reloadAll();
            this.showToast(`Currency changed to ${e.target.value}`, 'info');
        });

        // Search Input
        this.dom.searchInput.addEventListener('input', (e) => {
            this.activeFilters.search = e.target.value.toLowerCase().trim();
            this.app.filterAndRender();
        });

        // Filter flyout toggle
        this.dom.filterToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dom.filterFlyout.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!this.dom.filterFlyout.contains(e.target) && !this.dom.filterToggleBtn.contains(e.target)) {
                this.dom.filterFlyout.classList.remove('active');
            }
        });

        // Timeframe selector custom dates display
        this.dom.filterTimeframe.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                this.dom.filterCustomRange.style.display = 'flex';
            } else {
                this.dom.filterCustomRange.style.display = 'none';
            }
        });

        this.dom.txType.addEventListener('change', () => this.populateCategoryOptions());

        // Apply filters
        this.dom.btnApplyFilters.addEventListener('click', () => {
            this.activeFilters.type = this.dom.filterType.value;
            this.activeFilters.category = this.dom.filterCategory.value;
            this.activeFilters.timeframe = this.dom.filterTimeframe.value;
            this.activeFilters.customStart = this.dom.filterStart.value;
            this.activeFilters.customEnd = this.dom.filterEnd.value;
            this.activeFilters.sortBy = this.dom.filterSortBy.value;

            this.dom.filterFlyout.classList.remove('active');
            this.updateFilterBadgeCount();
            this.app.filterAndRender();
        });

        // Reset filters
        this.dom.btnResetFilters.addEventListener('click', () => {
            this.dom.filterType.value = 'all';
            this.dom.filterCategory.value = 'all';
            this.dom.filterTimeframe.value = 'all';
            this.dom.filterStart.value = '';
            this.dom.filterEnd.value = '';
            this.dom.filterSortBy.value = 'newest';
            this.dom.filterCustomRange.style.display = 'none';

            this.activeFilters = {
                type: 'all',
                category: 'all',
                timeframe: 'all',
                customStart: '',
                customEnd: '',
                sortBy: 'newest',
                search: this.dom.searchInput.value.toLowerCase().trim()
            };

            this.dom.filterFlyout.classList.remove('active');
            this.updateFilterBadgeCount();
            this.app.filterAndRender();
        });

        // Add Transaction Modal triggers
        document.querySelectorAll('.btn-add-tx-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const favoriteCategory = btn.dataset.category;
                const quickType = btn.dataset.type || 'expense';
                this.openTxModal(null, quickType, favoriteCategory);
            });
        });

        // Modal Form submission
        this.dom.formTx.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitTxForm();
        });

        // Close buttons modals
        document.querySelectorAll('.modal-close, .btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Click outside modal content to close
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAllModals();
                }
            });
        });

        // Overall Budget Settings Modal
        document.getElementById('btn-budget-settings').addEventListener('click', () => {
            this.dom.budgetLimitVal.value = this.app.budgetLimit;
            this.openModal(this.dom.modalBudget);
        });

        this.dom.formBudget.addEventListener('submit', async (e) => {
            e.preventDefault();
            const limit = parseFloat(this.dom.budgetLimitVal.value) || 0;
            await this.app.saveBudgetLimit(limit);
            this.closeAllModals();
            this.scrollToAndHighlight(this.dom.budgetProgressList, ':scope > :last-child');
        });

        // Category budgets modal trigger
        document.getElementById('btn-add-budget-trigger').addEventListener('click', () => {
            this.dom.formCategoryBudget.reset();
            this.openModal(this.dom.modalCategoryBudget);
        });

        this.dom.formCategoryBudget.addEventListener('submit', async (e) => {
            e.preventDefault();
            const category = this.dom.budgetCatSelect.value;
            const limit = parseFloat(this.dom.budgetCatLimit.value) || 0;
            await this.app.saveCategoryBudget(category, limit);
            this.closeAllModals();
            this.scrollToAndHighlight(this.dom.budgetProgressList, ':scope > :last-child');
        });

        // Virtual Accounts trigger
        document.getElementById('btn-add-account-trigger').addEventListener('click', () => {
            this.dom.formAccount.reset();
            this.openModal(this.dom.modalAccount);
        });

        this.dom.formAccount.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = this.dom.accountName.value.trim();
            const type = this.dom.accountType.value;
            await this.app.addAccount(name, type);
            this.closeAllModals();
            this.scrollToAndHighlight(this.dom.accountsList, ':scope > :last-child');
        });

        // Subscription Modal Trigger
        document.getElementById('btn-add-sub-trigger').addEventListener('click', () => {
            this.dom.formSubscription.reset();
            this.dom.subDate.value = new Date().toISOString().split('T')[0];
            this.openModal(this.dom.modalSubscription);
        });

        this.dom.formSubscription.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = this.dom.subName.value.trim();
            const amount = parseFloat(this.dom.subAmount.value) || 0;
            const date = this.dom.subDate.value;
            await this.app.addSubscription(name, amount, date);
            this.closeAllModals();
            this.scrollToAndHighlight(this.dom.subscriptionsList, ':scope > :last-child');
        });

        // Event delegation for list actions (Star, Edit, Delete)
        this.dom.transactionList.addEventListener('click', (e) => {
            const card = e.target.closest('.transaction-card');
            if (!card) return;

            const id = card.dataset.id;

            if (e.target.closest('.favorite-star')) {
                this.app.toggleFavorite(id);
            } else if (e.target.closest('.action-btn.edit')) {
                this.openTxModal(id);
            } else if (e.target.closest('.action-btn.delete')) {
                this.openDeleteModal(id);
            }
        });

        // Confirm Delete
        this.dom.btnConfirmDelete.addEventListener('click', () => {
            const id = this.dom.btnConfirmDelete.dataset.id;
            if (id) {
                this.app.deleteTransaction(id);
                this.closeAllModals();
            }
        });

        // Logout
        this.dom.btnLogout.addEventListener('click', () => {
            AuthManager.signOut();
        });
    }

    updateFilterBadgeCount() {
        let activeCount = 0;
        if (this.activeFilters.type !== 'all') activeCount++;
        if (this.activeFilters.category !== 'all') activeCount++;
        if (this.activeFilters.timeframe !== 'all') activeCount++;
        if (this.activeFilters.sortBy !== 'newest') activeCount++;

        const badge = this.dom.activeFilterBadgeCount;
        if (activeCount > 0) {
            badge.textContent = activeCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
        this.clearValidationStyles();
    }

    clearValidationStyles() {
        this.dom.formTx.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    }

    openTxModal(id = null, type = 'expense', category = null) {
        this.clearValidationStyles();
        this.dom.formTx.reset();

        if (id) {
            this.dom.modalTxTitle.textContent = 'Edit Transaction';
            const tx = this.app.transactions.find(t => t.id === id);
            if (tx) {
                this.dom.txId.value = tx.id;
                this.dom.txTitle.value = tx.title;
                this.dom.txAmount.value = tx.amount;
                this.dom.txType.value = tx.type;
                
                this.populateCategoryOptions();
                this.dom.txCategory.value = tx.category;
                
                this.dom.txDate.value = tx.date;
                this.dom.txNotes.value = tx.notes || '';
                this.dom.txFavorite.checked = tx.isFavorite || false;
                this.dom.txRecurring.checked = tx.isRecurring || false;
            }
        } else {
            this.dom.modalTxTitle.textContent = 'Add Transaction';
            this.dom.txId.value = '';
            this.dom.txType.value = type;
            this.populateCategoryOptions();
            
            if (category) {
                this.dom.txCategory.value = category.toLowerCase();
            }

            this.dom.txDate.value = new Date().toISOString().split('T')[0];
        }

        this.openModal(this.dom.modalTx);
    }

    openDeleteModal(id) {
        this.dom.btnConfirmDelete.dataset.id = id;
        this.openModal(this.dom.modalDelete);
    }

    submitTxForm() {
        const data = {
            id: this.dom.txId.value || null,
            title: this.dom.txTitle.value.trim(),
            amount: parseFloat(this.dom.txAmount.value),
            type: this.dom.txType.value,
            category: this.dom.txCategory.value,
            date: this.dom.txDate.value,
            notes: this.dom.txNotes.value.trim(),
            isFavorite: this.dom.txFavorite.checked,
            isRecurring: this.dom.txRecurring.checked,
            accountId: this.app.activeAccountId || 'acc_cash'
        };

        const valResult = ValidationManager.validateTransaction(data);

        this.clearValidationStyles();
        if (!valResult.isValid) {
            for (const [field, msg] of Object.entries(valResult.errors)) {
                const input = this.dom[`tx${field.charAt(0).toUpperCase() + field.slice(1)}`];
                if (input) {
                    input.classList.add('invalid');
                    const errEl = input.parentNode.querySelector('.error-msg');
                    if (errEl) errEl.textContent = msg;
                }
            }
            return;
        }

        const isEdit = !!data.id;
        this.app.saveTransaction(data, isEdit);
        this.closeAllModals();
        // Scroll to the transaction list and highlight the first (newest) card
        this.scrollToAndHighlight(this.dom.transactionList, ':scope > :first-child');
    }

    /**
     * Scrolls to a container element and highlights a child element
     * to visually indicate where the newly added item is located.
     * @param {HTMLElement} container - The parent container to scroll into view
     * @param {string} childSelector - CSS selector for the child element to highlight
     */
    scrollToAndHighlight(container, childSelector) {
        if (!container) return;

        // Wait a tick for the DOM to update after Firestore re-render
        setTimeout(() => {
            // Scroll the container section into view smoothly
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // After scroll completes, highlight the target child
            setTimeout(() => {
                const target = container.querySelector(childSelector);
                if (target) {
                    target.classList.add('highlight-new-item');
                    // Remove highlight class after animation finishes
                    target.addEventListener('animationend', () => {
                        target.classList.remove('highlight-new-item');
                    }, { once: true });
                }
            }, 400);
        }, 300);
    }
}
window.UIManager = UIManager;
