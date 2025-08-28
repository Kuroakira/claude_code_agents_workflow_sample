import { store } from './store.js';

class TodoList {
  constructor() {
    this.state = {
      tasks: [],
      filter: 'all',
      lastSync: Date.now()
    };
    this.listeners = [];
    this.saveDebounced = this.debounce(this.saveToStore.bind(this), 500);
  }

  init() {
    const savedState = store.load();
    if (savedState) {
      this.state = savedState;
    }
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.state));
  }

  dispatch(action, payload) {
    switch (action) {
      case 'ADD_TASK':
        this.addTask(payload.text);
        break;
      case 'TOGGLE_TASK':
        this.toggleTask(payload.id);
        break;
      case 'DELETE_TASK':
        this.deleteTask(payload.id);
        break;
      case 'REORDER_TASKS':
        this.reorderTasks(payload.fromIndex, payload.toIndex);
        break;
      case 'SET_FILTER':
        this.setFilter(payload.filter);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }

  addTask(text) {
    if (!text || !text.trim()) {
      return false;
    }

    const newTask = {
      id: this.generateId(),
      text: text.trim(),
      completed: false,
      order: this.state.tasks.length,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.state.tasks.push(newTask);
    this.state.lastSync = Date.now();
    this.saveDebounced();
    this.notifyListeners();
    return true;
  }

  toggleTask(id) {
    const task = this.state.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.updatedAt = Date.now();
      this.state.lastSync = Date.now();
      this.saveDebounced();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  deleteTask(id) {
    const index = this.state.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.state.tasks.splice(index, 1);
      this.updateOrders();
      this.state.lastSync = Date.now();
      this.saveDebounced();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  reorderTasks(fromIndex, toIndex) {
    if (fromIndex === toIndex) return false;
    
    const tasks = [...this.state.tasks];
    const [movedTask] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, movedTask);
    
    this.state.tasks = tasks;
    this.updateOrders();
    this.state.lastSync = Date.now();
    this.saveDebounced();
    this.notifyListeners();
    return true;
  }

  setFilter(filter) {
    if (['all', 'active', 'completed'].includes(filter)) {
      this.state.filter = filter;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  getFilteredTasks() {
    switch (this.state.filter) {
      case 'active':
        return this.state.tasks.filter(t => !t.completed);
      case 'completed':
        return this.state.tasks.filter(t => t.completed);
      default:
        return this.state.tasks;
    }
  }

  getTaskCounts() {
    const active = this.state.tasks.filter(t => !t.completed).length;
    const completed = this.state.tasks.filter(t => t.completed).length;
    return { active, completed, total: this.state.tasks.length };
  }

  updateOrders() {
    this.state.tasks.forEach((task, index) => {
      task.order = index;
      task.updatedAt = Date.now();
    });
  }

  saveToStore() {
    store.save(this.state);
  }

  generateId() {
    return 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

export const todoList = new TodoList();