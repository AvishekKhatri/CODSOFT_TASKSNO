/**
 * ZenTask - Form Input Validation Module
 */

export const ValidationController = {
    /**
     * Validate Task Title input
     * @param {string} title 
     * @returns {Object} { isValid: boolean, error: string }
     */
    validateTitle(title) {
        if (!title || title.trim() === '') {
            return {
                isValid: false,
                error: 'Task title is required.'
            };
        }
        return { isValid: true, error: '' };
    },

    /**
     * Check if a task title already exists in database
     * @param {string} title 
     * @param {Array} tasks 
     * @param {string|null} excludeId - task ID to ignore (during editing)
     * @returns {Object} { isDuplicate: boolean, message: string }
     */
    checkDuplicate(title, tasks, excludeId = null) {
        const cleanedTitle = title.trim().toLowerCase();
        const duplicate = tasks.find(t => 
            t.title.trim().toLowerCase() === cleanedTitle && 
            t.id !== excludeId
        );

        if (duplicate) {
            return {
                isDuplicate: true,
                message: 'A task with this title already exists.'
            };
        }
        return { isDuplicate: false, message: '' };
    },

    /**
     * Warning for due dates set in the past
     * @param {string} dateStr - 'YYYY-MM-DD'
     * @returns {boolean} true if date is in the past (excluding today)
     */
    isPastDate(dateStr) {
        if (!dateStr) return false;
        
        // Get start of today (local time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const selectedDate = new Date(dateStr + 'T00:00:00');
        
        return selectedDate < today;
    }
};
