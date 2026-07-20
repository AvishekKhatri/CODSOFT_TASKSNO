/**
 * Theme Module
 * Manages dark and light theme switching.
 */

class ThemeManager {
    static init() {
        const savedTheme = StorageManager.getTheme();
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const activeTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.setTheme(activeTheme);

        // Listen for OS theme updates if no preference is saved
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('expense_tracker_theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    static setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-mode');
        }
        StorageManager.saveTheme(theme);
    }

    static toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        return newTheme;
    }
}
window.ThemeManager = ThemeManager;
