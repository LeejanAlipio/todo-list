import Todo from "./todo.js";

const projectList = [];

export const getProjectList = () => [...projectList];

export const clearProjects = () => {
  projectList.length = 0;
};

export const createDefaultProject = () => {
  if (projectList.length === 0) {
    const defaultProject = new Project("Default", "Default Project");
    addProject(defaultProject);
    return defaultProject;
  }

  return projectList[0];
};

export const addProject = (project) => {
  projectList.push(project);
  return project;
};

export default class Project {
  constructor(name, description = "") {
    this.name = name;
    this.description = description;
    this.projectTasks = [];
  }

  addTodo(taskData) {
    const newTodo = new Todo(taskData);
    this.projectTasks.push(newTodo);
  }

  removeTodo(id) {
    const todoIndex = this.projectTasks.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      this.projectTasks.splice(todoIndex, 1);
    }
  }

  getProjectTasks() {
    return [...this.projectTasks];
  }
}