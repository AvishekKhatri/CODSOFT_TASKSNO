/**
 * Storage Module
 * Manages LocalStorage interactions for general system preferences (theme and currency).
 * All user financial data is handled by Firestore.
 */

const STORAGE_KEYS = {
    THEME: 'spendora_theme',
    CURRENCY: 'spendora_currency'
};

class StorageManager {
    // --- General Settings ---
    static getTheme() {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    }

    static saveTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }

    static getCurrency() {
        return localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'USD';
    }

    static saveCurrency(currency) {
        localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    }

    // --- Export/Import CSV Helpers ---
    static exportToCSV(transactions) {
        if (!transactions || transactions.length === 0) return '';

        const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date', 'Notes', 'AccountId', 'IsFavorite', 'IsRecurring'];
        const csvRows = [headers.join(',')];

        for (const t of transactions) {
            const values = [
                t.id,
                `"${(t.title || '').replace(/"/g, '""')}"`,
                t.amount,
                t.type,
                t.category,
                t.date,
                `"${(t.notes || '').replace(/"/g, '""')}"`,
                t.accountId || 'acc_cash',
                t.isFavorite ? 'true' : 'false',
                t.isRecurring ? 'true' : 'false'
            ];
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }

    static parseCSV(csvText) {
        try {
            const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (lines.length <= 1) return { success: false, error: 'CSV file is empty or missing headers' };

            const parseCSVLine = (line) => {
                const result = [];
                let current = '';
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        if (inQuotes && line[i + 1] === '"') {
                            current += '"';
                            i++;
                        } else {
                            inQuotes = !inQuotes;
                        }
                    } else if (char === ',' && !inQuotes) {
                        result.push(current);
                        current = '';
                    } else {
                        current += char;
                    }
                }
                result.push(current);
                return result;
            };

            const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
            const parsedTransactions = [];

            for (let i = 1; i < lines.length; i++) {
                const row = parseCSVLine(lines[i]);
                if (row.length < 5) continue;

                const t = {};
                headers.forEach((header, index) => {
                    const val = row[index] ? row[index].trim() : '';
                    if (header === 'id') t.id = val;
                    else if (header === 'title') t.title = val;
                    else if (header === 'amount') t.amount = parseFloat(val) || 0;
                    else if (header === 'type') t.type = val.toLowerCase() === 'income' ? 'income' : 'expense';
                    else if (header === 'category') t.category = val;
                    else if (header === 'date') t.date = val;
                    else if (header === 'notes') t.notes = val;
                    else if (header === 'accountid') t.accountId = val;
                    else if (header === 'isfavorite') t.isFavorite = val === 'true';
                    else if (header === 'isrecurring') t.isRecurring = val === 'true';
                });

                if (!t.accountId) t.accountId = 'acc_cash';

                if (t.title && t.amount > 0 && t.category && t.date) {
                    parsedTransactions.push(t);
                }
            }

            if (parsedTransactions.length === 0) return { success: false, error: 'No valid rows' };
            return { success: true, transactions: parsedTransactions };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
}
window.StorageManager = StorageManager;
