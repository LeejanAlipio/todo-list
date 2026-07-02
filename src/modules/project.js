import Todo from "./todo.js";

const projectList = [];

export const getProjectList = () => [...projectList];

export const createDefaultProject = () => {
  if (projectList.length === 0) {
    const defaultProject = new Project("Default", "Default Project");
    defaultProject.addTodo('Heavenly')
    projectList.push(defaultProject);
  }
}

export const addProject = (project) => {
  projectList.push(project);
}

export default class Project {
  constructor(name, description = '') {
    this.name = name;
    this.description = description;
    this.projectTasks = [];
  }

  addTodo(name, description, dueDate, priority, status) {
    const newTodo = new Todo(name, description, dueDate, priority, status)
    this.projectTasks.push(newTodo);
  }

  removeTodo(id) {
    const todoIndex = this.projectTasks.findIndex(todo => todo.id == id);
    if (todoIndex !== -1) {
      this.projectTasks.splice(todoIndex, 1);
    }
  }

  getProjectTasks() {
    return [...this.projectTasks];
  }
}