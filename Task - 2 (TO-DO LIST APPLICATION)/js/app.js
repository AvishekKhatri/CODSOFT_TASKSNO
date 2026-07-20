/**
 * ZenTask - Main Application Entry Module
 */

import { StorageController } from './storage.js';
import { ThemeController } from './theme.js';
import { ValidationController } from './validation.js';
import { UIController } from './ui.js';
import { onAuthChange, signOutUser, updateUserProfile } from './auth.js';

// State
let tasks = [];
let activeFilters = { search: '', status: 'all', category: 'all', priority: 'all', sortBy: 'newest' };
let currentUser = null;

// Default Starter Tasks
const DEFAULT_TASKS = [
    {
        id: 'task-welcome',
        title: 'Welcome to ZenTask! 🌟 Create your first list.',
        desc: 'This is a premium task manager running entirely in the browser using HTML5 Local Storage.',
        category: 'Personal',
        priority: 'high',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        createdAt: Date.now() - 300000
    },
    {
        id: 'task-categories',
        title: 'Explore task categories 💼 & color badges',
        desc: 'Set tasks for Work, Study, Shopping, Health, and Personal life.',
        category: 'Work',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        completed: true,
        createdAt: Date.now() - 240000
    },
    {
        id: 'task-sorting',
        title: 'Sort tasks by priority or due dates 📅',
        desc: 'Click on the sort dropdown to arrange tasks in different orders.',
        category: 'Study',
        priority: 'low',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        completed: false,
        createdAt: Date.now() - 180000
    }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    ThemeController.init();
    
    const creationDateInput = document.getElementById('task-due-date');
    if (creationDateInput) {
        creationDateInput.value = new Date().toISOString().split('T')[0];
    }

    onAuthChange((user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        currentUser = user;
        const userProfile = document.getElementById('user-profile');
        if (userProfile) {
            userProfile.style.display = 'flex';
        }

        StorageController.setUserId(user.uid);
        tasks = StorageController.loadTasks() || [...DEFAULT_TASKS];
        if (!StorageController.loadTasks()) {
            StorageController.saveTasks(tasks);
        }
        updateUI();
    });

    setupAppEventListeners();
    const titleInput = document.getElementById('task-title');
    if (titleInput) titleInput.focus();
});

// Update Screen state
function updateUI() {
    let filtered = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(activeFilters.search.toLowerCase()) || 
                             (task.desc && task.desc.toLowerCase().includes(activeFilters.search.toLowerCase()));
        
        let matchesStatus = activeFilters.status === 'all' || 
                            (activeFilters.status === 'completed' ? task.completed : !task.completed);

        return matchesSearch && matchesStatus && 
               (activeFilters.category === 'all' || task.category === activeFilters.category) && 
               (activeFilters.priority === 'all' || task.priority === activeFilters.priority);
    });

    const sortRoutines = {
        'oldest': (a, b) => a.createdAt - b.createdAt,
        'due-date': (a, b) => !a.dueDate ? 1 : (!b.dueDate ? -1 : new Date(a.dueDate) - new Date(b.dueDate)),
        'priority': (a, b) => ({ high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority]),
        'alphabetical': (a, b) => a.title.localeCompare(b.title),
        'newest': (a, b) => b.createdAt - a.createdAt
    };
    
    filtered.sort(sortRoutines[activeFilters.sortBy] || sortRoutines['newest']);

    UIController.renderTasks(filtered, {
        onToggle: handleTaskToggle,
        onEdit: handleTaskEditRequest,
        onDelete: handleTaskDelete
    });

    UIController.updateStats(tasks);
}

// Event Handlers
function handleTaskToggle(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        StorageController.saveTasks(tasks);
        UIController.showToast(`Task "${task.title}" marked as ${task.completed ? 'Completed' : 'Pending'}.`, task.completed ? 'success' : 'info');
        updateUI();
    }
}

function handleTaskEditRequest(task) {
    UIController.openEditModal(task);
}

function handleTaskDelete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        tasks = tasks.filter(t => t.id !== id);
        StorageController.saveTasks(tasks);
        UIController.showToast(`Task "${task.title}" deleted.`, 'danger');
        updateUI();
    }
}

// Bind all App Event Listeners
function setupAppEventListeners() {
    const getEl = id => document.getElementById(id);
    const elements = {
        form: getEl('task-form'),
        title: getEl('task-title'),
        desc: getEl('task-desc'),
        category: getEl('task-category'),
        priority: getEl('task-priority'),
        dueDate: getEl('task-due-date'),
        editTitle: getEl('edit-task-title'),
        editDueDate: getEl('edit-task-due-date'),
        search: getEl('search-input'),
        filterCat: getEl('filter-category'),
        sort: getEl('sort-by'),
        clearFilters: getEl('clear-filters-btn'),
        clearCompleted: getEl('clear-completed-btn'),
        clearAll: getEl('clear-all-btn'),
        themeToggle: getEl('theme-toggle'),
        logout: getEl('logout-btn')
    };

    // Theme Switcher
    elements.themeToggle.addEventListener('click', () => {
        const theme = ThemeController.toggle();
        UIController.showToast(`Theme switched to ${theme === 'dark' ? 'Dark Mode' : 'Light Mode'}.`, 'info');
    });

    // Logout
    if (elements.logout) {
        elements.logout.addEventListener('click', async () => {
            if (confirm('Are you sure you want to log out?')) {
                const res = await signOutUser();
                if (res.success) window.location.href = 'login.html';
                else UIController.showToast(res.error, 'danger');
            }
        });
    }

    // Input Helpers
    const setupFieldHelp = (input, event, validationCheck, className) => {
        input.addEventListener(event, () => {
            input.parentElement.classList.toggle(className, validationCheck(input.value));
        });
    };
    setupFieldHelp(elements.title, 'input', val => !val.trim(), 'invalid');
    setupFieldHelp(elements.editTitle, 'input', val => !val.trim(), 'invalid');
    setupFieldHelp(elements.dueDate, 'change', val => ValidationController.isPastDate(val), 'has-warning');
    setupFieldHelp(elements.editDueDate, 'change', val => ValidationController.isPastDate(val), 'has-warning');

    // Task Creation Form submit
    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = elements.title.value.trim();
        if (!ValidationController.validateTitle(title).isValid) {
            elements.title.parentElement.classList.add('invalid');
            return;
        }

        const duplicate = ValidationController.checkDuplicate(title, tasks);
        if (duplicate.isDuplicate) UIController.showToast(duplicate.message, 'warning');

        tasks.unshift({
            id: 'task-' + Date.now(),
            title,
            desc: elements.desc.value.trim(),
            category: elements.category.value,
            priority: elements.priority.value,
            dueDate: elements.dueDate.value || null,
            completed: false,
            createdAt: Date.now()
        });

        StorageController.saveTasks(tasks);
        UIController.showToast('Task added successfully.', 'success');
        elements.title.value = '';
        elements.desc.value = '';
        elements.category.value = 'Personal';
        elements.priority.value = 'medium';
        elements.dueDate.value = new Date().toISOString().split('T')[0];
        elements.dueDate.parentElement.classList.remove('has-warning');
        updateUI();
        elements.title.focus();
    });

    // Edit Modal form submit
    getEl('edit-task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = getEl('edit-task-id').value;
        const title = elements.editTitle.value.trim();
        if (!ValidationController.validateTitle(title).isValid) {
            elements.editTitle.parentElement.classList.add('invalid');
            return;
        }

        const task = tasks.find(t => t.id === id);
        if (task) {
            Object.assign(task, {
                title,
                desc: getEl('edit-task-desc').value.trim(),
                category: getEl('edit-task-category').value,
                priority: getEl('edit-task-priority').value,
                dueDate: elements.editDueDate.value || null
            });
            StorageController.saveTasks(tasks);
            UIController.showToast('Task updated successfully.', 'success');
            UIController.closeEditModal();
            updateUI();
        }
    });

    // Close Modal buttons
    getEl('close-modal-btn').addEventListener('click', () => UIController.closeEditModal());
    getEl('cancel-edit-btn').addEventListener('click', () => UIController.closeEditModal());

    // Profile Modal buttons
    const profileBtn = getEl('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => UIController.openProfileModal(currentUser));
    }
    getEl('close-profile-modal-btn').addEventListener('click', () => UIController.closeProfileModal());
    getEl('close-profile-btn').addEventListener('click', () => UIController.closeProfileModal());

    getEl('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = getEl('profile-name-input').value.trim();
        const newUid = getEl('profile-uid-input').value.trim();

        if (!newUid) {
            UIController.showToast('User Identifier (UID) cannot be empty.', 'danger');
            return;
        }

        if (newName !== (currentUser?.displayName || '')) {
            const res = await updateUserProfile(newName);
            if (res.success && currentUser) currentUser.displayName = newName;
        }

        if (newUid !== (currentUser?.uid || '')) {
            StorageController.setUserId(newUid);
            if (currentUser) currentUser.uid = newUid;
            tasks = StorageController.loadTasks() || [];
        }

        UIController.showToast('Profile updated successfully.', 'success');
        UIController.closeProfileModal();
        updateUI();
    });

    // Search and filters
    elements.search.addEventListener('input', e => {
        activeFilters.search = e.target.value;
        updateUI();
    });

    const setupTabFilters = (containerId, filterKey) => {
        const container = getEl(containerId);
        if (!container) return;
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab-btn');
            if (!btn) return;
            container.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
            });
            activeFilters[filterKey] = btn.dataset.filterValue;
            updateUI();
        });
    };
    setupTabFilters('status-filters', 'status');
    setupTabFilters('priority-filters', 'priority');

    elements.filterCat.addEventListener('change', e => {
        activeFilters.category = e.target.value;
        updateUI();
    });

    elements.sort.addEventListener('change', e => {
        activeFilters.sortBy = e.target.value;
        updateUI();
    });

    // Clear filters
    const resetTabs = (containerId) => {
        const container = getEl(containerId);
        if (!container) return;
        container.querySelectorAll('.tab-btn').forEach(b => {
            const isAll = b.dataset.filterValue === 'all';
            b.classList.toggle('active', isAll);
            b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
        });
    };

    elements.clearFilters.addEventListener('click', () => {
        activeFilters = { search: '', status: 'all', category: 'all', priority: 'all', sortBy: 'newest' };
        elements.search.value = '';
        elements.filterCat.value = 'all';
        elements.sort.value = 'newest';
        resetTabs('status-filters');
        resetTabs('priority-filters');
        UIController.showToast('All filters have been reset.', 'info');
        updateUI();
    });

    // Clear completed tasks
    elements.clearCompleted.addEventListener('click', () => {
        const completed = tasks.filter(t => t.completed).length;
        if (!completed) {
            UIController.showToast('No completed tasks to clear.', 'info');
            return;
        }
        tasks = tasks.filter(t => !t.completed);
        StorageController.saveTasks(tasks);
        UIController.showToast(`Cleared ${completed} completed tasks.`, 'success');
        updateUI();
    });

    // Clear all tasks
    elements.clearAll.addEventListener('click', () => {
        if (!tasks.length) {
            UIController.showToast('No tasks to clear.', 'info');
            return;
        }
        if (confirm('Are you sure you want to delete ALL tasks? This action is permanent.')) {
            tasks = [];
            StorageController.saveTasks(tasks);
            UIController.showToast('All tasks cleared from local storage.', 'danger');
            updateUI();
        }
    });

    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            UIController.closeEditModal();
            UIController.closeProfileModal();
        }
    });
}
