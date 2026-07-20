/**
 * ZenTask - UI Theme Controller Module
 */
import { StorageController } from './storage.js';

export const ThemeController = {
    currentTheme: 'light',

    /**
     * Initialize the theme preference
     * @returns {string} active theme
     */
    init() {
        const storedTheme = StorageController.loadTheme();
        if (storedTheme) {
            this.currentTheme = storedTheme;
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
        }
        
        this.applyTheme();
        return this.currentTheme;
    },

    /**
     * Toggle between light and dark theme
     * @returns {string} new active theme
     */
    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        StorageController.saveTheme(this.currentTheme);
        return this.currentTheme;
    },

    /**
     * Apply active theme parameter to HTML document element
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
};
