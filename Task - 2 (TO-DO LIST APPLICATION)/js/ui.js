/**
 * ZenTask - UI Rendering and Element Controller Module
 */

export const UIController = {
    // Selectors
    elements: {
        tasksContainer: document.getElementById('tasks-container'),
        emptyState: document.getElementById('empty-state'),
        toastContainer: document.getElementById('toast-container'),
        statsTotal: document.getElementById('stats-total'),
        statsCompleted: document.getElementById('stats-completed'),
        statsPending: document.getElementById('stats-pending'),
        statsOverdue: document.getElementById('stats-overdue'),
        statsProgressFill: document.getElementById('stats-progress-fill'),
        statsProgressText: document.getElementById('stats-progress-text'),
        editModal: document.getElementById('edit-modal'),
        editTaskId: document.getElementById('edit-task-id'),
        editTaskTitle: document.getElementById('edit-task-title'),
        editTaskDesc: document.getElementById('edit-task-desc'),
        editTaskCategory: document.getElementById('edit-task-category'),
        editTaskPriority: document.getElementById('edit-task-priority'),
        editTaskDueDate: document.getElementById('edit-task-due-date'),
        editTitleError: document.getElementById('edit-title-error'),
        editDateWarning: document.getElementById('edit-date-warning'),
        profileModal: document.getElementById('profile-modal'),
        profileNameInput: document.getElementById('profile-name-input'),
        profileEmail: document.getElementById('profile-email-display'),
        profileUidInput: document.getElementById('profile-uid-input')
    },

    /**
     * Display a toast notification popup
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const pathData = {
            success: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01 9 11.01',
            danger: 'M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm3 6L9 14 M9 8l6 6',
            warning: 'M12 9v4 M12 17h.01 M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z',
            info: 'M12 16v-4 M12 8h.01 M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z'
        };

        const colors = { success: 'var(--color-completed)', danger: 'var(--color-high)', warning: 'var(--color-medium)', info: 'var(--primary)' };

        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${colors[type] || colors.info}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px">
                    <path d="${pathData[type] || pathData.info}"/>
                </svg>
                <span>${message}</span>
            </div>
            <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem; padding-left:12px; display:flex;" aria-label="Close toast">&times;</button>
        `;

        const removeToast = () => {
            if (!toast.parentNode) return;
            toast.classList.add('toast-fadeout');
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
        };

        toast.querySelector('button').addEventListener('click', removeToast);
        this.elements.toastContainer.appendChild(toast);
        setTimeout(removeToast, 5000);
    },

    /**
     * Update the Statistics counters on the UI
     */
    updateStats(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        const todayStr = new Date().toISOString().split('T')[0];
        const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;

        this.elements.statsTotal.textContent = total;
        this.elements.statsCompleted.textContent = completed;
        this.elements.statsPending.textContent = pending;
        this.elements.statsOverdue.textContent = overdue;

        const percentage = total ? Math.round((completed / total) * 100) : 0;
        this.elements.statsProgressFill.style.width = `${percentage}%`;
        this.elements.statsProgressText.textContent = `${percentage}% Completed`;
    },

    /**
     * Render the active tasks list in the main container
     */
    renderTasks(filteredTasks, callbacks) {
        this.elements.tasksContainer.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.elements.emptyState.style.display = 'flex';
            return;
        }

        this.elements.emptyState.style.display = 'none';

        filteredTasks.forEach(task => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
            const remaining = this.getRemainingDaysText(task.dueDate, task.completed);

            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.completed ? 'completed-task' : ''}`;
            taskCard.id = task.id;

            const priorityLabels = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
            const categoryEmojis = { Personal: '👤 Personal', Work: '💼 Work', Study: '🎓 Study', Shopping: '🛒 Shopping', Health: '❤️ Health', Other: '✨ Other' };

            const statusButtonHTML = task.completed 
                ? `<button class="status-badge-btn completed" aria-label="Task completed. Click to mark as pending.">✓ Completed</button>`
                : `<button class="status-badge-btn pending" aria-label="Click to complete task">Complete Work</button>`;

            taskCard.innerHTML = `
                <div class="task-status-area">${statusButtonHTML}</div>
                <div class="task-info-content">
                    <span class="task-title-text">${this.escapeHTML(task.title)}</span>
                    ${task.desc ? `<p class="task-desc-text">${this.escapeHTML(task.desc)}</p>` : ''}
                    <div class="task-meta-tags">
                        <span class="tag tag-category ${task.category}">${categoryEmojis[task.category] || task.category}</span>
                        <span class="tag tag-priority ${task.priority}">${priorityLabels[task.priority]}</span>
                        ${task.dueDate ? `
                            <span class="tag tag-due-date ${isOverdue ? 'overdue' : ''} ${remaining.warning ? 'warning-soon' : ''}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                                </svg>
                                <span>${this.formatDisplayDate(task.dueDate)}</span>
                            </span>
                            <span class="tag tag-due-date ${isOverdue ? 'overdue' : ''} ${remaining.warning ? 'warning-soon' : ''}" style="border-left:none; padding-left: 2px;">
                                <span>${remaining.text}</span>
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn edit-btn" aria-label="Edit task info" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </button>
                    <button class="action-btn delete-btn" aria-label="Delete this task" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            `;

            taskCard.querySelector('.status-badge-btn').addEventListener('click', () => callbacks.onToggle(task.id));
            taskCard.querySelector('.edit-btn').addEventListener('click', () => callbacks.onEdit(task));
            
            const deleteBtn = taskCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                taskCard.classList.add('fade-out');
                taskCard.addEventListener('transitionend', () => callbacks.onDelete(task.id), { once: true });
            });

            this.elements.tasksContainer.appendChild(taskCard);
        });
    },

    /**
     * Show Modal window populated with task details
     */
    openEditModal(task) {
        this.elements.editTaskId.value = task.id;
        this.elements.editTaskTitle.value = task.title;
        this.elements.editTaskDesc.value = task.desc || '';
        this.elements.editTaskCategory.value = task.category;
        this.elements.editTaskPriority.value = task.priority;
        this.elements.editTaskDueDate.value = task.dueDate || '';
        
        this.elements.editTitleError.parentElement.classList.remove('invalid');
        this.elements.editDateWarning.parentElement.classList.remove('has-warning');
        this.elements.editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeEditModal() {
        this.elements.editModal.classList.remove('active');
        document.body.style.overflow = '';
    },

    openProfileModal(user) {
        if (!user) return;
        this.elements.profileNameInput.value = user.displayName || '';
        this.elements.profileEmail.textContent = user.email || 'N/A';
        this.elements.profileUidInput.value = user.uid || 'N/A';
        this.elements.profileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeProfileModal() {
        this.elements.profileModal.classList.remove('active');
        document.body.style.overflow = '';
    },

    /**
     * Compute remaining days label
     */
    getRemainingDaysText(dateStr, isCompleted) {
        if (!dateStr) return { text: '', warning: false };
        if (isCompleted) return { text: 'Completed', warning: false };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil((new Date(dateStr + 'T00:00:00') - today) / 86400000);

        if (diffDays < 0) return { text: 'Overdue', warning: false };
        if (diffDays === 0) return { text: 'Today', warning: true };
        if (diffDays === 1) return { text: 'Tomorrow', warning: true };
        return { text: `${diffDays} days left`, warning: diffDays <= 3 };
    },

    formatDisplayDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    escapeHTML(str) {
        const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return str.replace(/[&<>"']/g, m => entities[m]);
    }
};
