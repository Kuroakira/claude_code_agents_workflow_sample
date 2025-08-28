const STORAGE_KEY = 'todo-app-state';

export const store = {
  save(data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded');
        return false;
      }
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  },

  load() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        return null;
      }
      
      const data = JSON.parse(serialized);
      return this.validate(data) ? data : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  },

  validate(data) {
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    if (!Array.isArray(data.tasks)) {
      return false;
    }
    
    return data.tasks.every(task => 
      typeof task.id === 'string' &&
      typeof task.text === 'string' &&
      typeof task.completed === 'boolean' &&
      typeof task.order === 'number' &&
      typeof task.createdAt === 'number' &&
      typeof task.updatedAt === 'number'
    );
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  },

  getSize() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY) || '';
      return new Blob([serialized]).size;
    } catch (error) {
      return 0;
    }
  }
};