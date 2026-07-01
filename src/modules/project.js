import Todo from "./todo.js";

const projectList = [];

const getProjectList = () => [...projectList];

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
}