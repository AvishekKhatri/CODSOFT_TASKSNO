/**
 * ZenTask - Local Storage Controller Module
 * Task storage is scoped per-user via Firebase UID.
 * Theme storage remains global (device-level preference).
 */

const STORAGE_PREFIX = 'zentask_tasks';
const THEME_KEY = 'zentask_theme';

let activeUserId = null;

export const StorageController = {
    /**
     * Set the active user ID for UID-scoped task storage.
     * Must be called before saveTasks / loadTasks.
     * @param {string} uid - Firebase user UID
     */
    setUserId(uid) {
        activeUserId = uid;
    },

    /**
     * Get the task storage key scoped to current user
     * @returns {string}
     */
    _getTaskKey() {
        if (!activeUserId) {
            console.warn('StorageController: No user ID set. Tasks will use a shared key.');
            return STORAGE_PREFIX;
        }
        return `${STORAGE_PREFIX}_${activeUserId}`;
    },

    /**
     * Save tasks list to local storage (UID-scoped)
     * @param {Array} tasks 
     */
    saveTasks(tasks) {
        try {
            localStorage.setItem(this._getTaskKey(), JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to Local Storage:', error);
        }
    },

    /**
     * Load tasks list from local storage (UID-scoped)
     * @returns {Array|null}
     */
    loadTasks() {
        try {
            const data = localStorage.getItem(this._getTaskKey());
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading tasks from Local Storage:', error);
            return null;
        }
    },

    /**
     * Save user theme choice (global, not UID-scoped)
     * @param {string} theme 
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    },

    /**
     * Load theme choice from local storage (global)
     * @returns {string|null}
     */
    loadTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (error) {
            console.error('Error reading theme preference:', error);
            return null;
        }
    }
};
