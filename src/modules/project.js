import Todo from "./todo.js";

const STORAGE_KEY = 'todo-list-projects';
const projectList = [];

export const getProjectList = () => [...projectList];

export const saveProjects = () => {
  const data = projectList.map(project => ({
    name: project.name,
    description: project.description,
    projectTasks: project.projectTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    })),
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadProjects = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);

    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    data.forEach((projectData) => {
      const project = new Project(projectData.name, projectData.description);
      projectData.projectTasks?.forEach((taskData) => {
        project.projectTasks.push(
          new Todo(
            taskData.title,
            taskData.description,
            taskData.dueDate,
            taskData.priority,
            taskData.status,
            taskData.id,
          ),
        );
      });
      projectList.push(project);
    });

    return true;
  } catch {
    return false;
  }
};

export const createDefaultProject = () => {
  if (projectList.length === 0) {
    const defaultProject = new Project("Default", "Default Project");
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
    const todoIndex = this.projectTasks.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      this.projectTasks.splice(todoIndex, 1);
    }
  }

  getProjectTasks() {
    return [...this.projectTasks];
  }
}