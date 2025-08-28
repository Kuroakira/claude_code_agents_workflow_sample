import { todoList } from './todoList.js';

class UI {
  constructor() {
    this.elements = {};
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.render();
    
    todoList.subscribe((state) => {
      this.render();
    });
  }

  cacheElements() {
    this.elements.input = document.getElementById('new-task-input');
    this.elements.addBtn = document.getElementById('add-task-btn');
    this.elements.taskList = document.getElementById('task-list');
    this.elements.emptyState = document.getElementById('empty-state');
    this.elements.counter = document.getElementById('counter');
  }

  bindEvents() {
    this.elements.addBtn.addEventListener('click', () => this.handleAdd());
    
    this.elements.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleAdd();
      }
    });
    
    this.elements.taskList.addEventListener('click', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (!taskItem) return;
      
      const taskId = taskItem.dataset.id;
      
      if (e.target.classList.contains('task-checkbox')) {
        this.handleToggle(taskId);
      } else if (e.target.classList.contains('delete-btn')) {
        this.handleDelete(taskId);
      }
    });
  }

  handleAdd() {
    const text = this.elements.input.value.trim();
    if (text) {
      todoList.dispatch('ADD_TASK', { text });
      this.elements.input.value = '';
      this.elements.input.focus();
    }
  }

  handleToggle(id) {
    todoList.dispatch('TOGGLE_TASK', { id });
  }

  handleDelete(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
      taskElement.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        todoList.dispatch('DELETE_TASK', { id });
      }, 300);
    }
  }

  render() {
    const tasks = todoList.getFilteredTasks();
    const counts = todoList.getTaskCounts();
    
    this.updateCounter(counts);
    this.updateEmptyState(tasks.length === 0);
    this.renderTasks(tasks);
  }

  updateCounter(counts) {
    const text = `${counts.active} active, ${counts.completed} completed`;
    this.elements.counter.textContent = text;
  }

  updateEmptyState(isEmpty) {
    this.elements.emptyState.style.display = isEmpty ? 'block' : 'none';
    this.elements.taskList.style.display = isEmpty ? 'none' : 'flex';
  }

  renderTasks(tasks) {
    const currentIds = new Set(tasks.map(t => t.id));
    const existingIds = new Set(
      Array.from(this.elements.taskList.children).map(el => el.dataset.id)
    );
    
    existingIds.forEach(id => {
      if (!currentIds.has(id)) {
        const element = this.elements.taskList.querySelector(`[data-id="${id}"]`);
        if (element) element.remove();
      }
    });
    
    tasks.forEach((task, index) => {
      let taskElement = this.elements.taskList.querySelector(`[data-id="${task.id}"]`);
      
      if (!taskElement) {
        taskElement = this.createTaskElement(task);
        taskElement.style.animation = 'slideIn 0.3s ease forwards';
        
        if (index >= this.elements.taskList.children.length) {
          this.elements.taskList.appendChild(taskElement);
        } else {
          this.elements.taskList.insertBefore(
            taskElement, 
            this.elements.taskList.children[index]
          );
        }
      } else {
        this.updateTaskElement(taskElement, task);
        
        const currentIndex = Array.from(this.elements.taskList.children).indexOf(taskElement);
        if (currentIndex !== index) {
          if (index >= this.elements.taskList.children.length - 1) {
            this.elements.taskList.appendChild(taskElement);
          } else {
            this.elements.taskList.insertBefore(
              taskElement,
              this.elements.taskList.children[index]
            );
          }
        }
      }
    });
  }

  createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    li.draggable = true;
    li.setAttribute('role', 'listitem');
    
    li.innerHTML = `
      <button 
        class="task-checkbox ${task.completed ? 'checked' : ''}"
        aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}"
        aria-pressed="${task.completed}"
      ></button>
      <span class="task-text">${this.escapeHtml(task.text)}</span>
      <button class="delete-btn" aria-label="Delete task">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/>
        </svg>
      </button>
    `;
    
    return li;
  }

  updateTaskElement(element, task) {
    element.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    const checkbox = element.querySelector('.task-checkbox');
    checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
    checkbox.setAttribute('aria-label', task.completed ? 'Mark as incomplete' : 'Mark as complete');
    checkbox.setAttribute('aria-pressed', task.completed);
    
    const text = element.querySelector('.task-text');
    text.textContent = task.text;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export const ui = new UI();