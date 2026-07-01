export default class Todo {
  constructor(title, description = '', dueDate = '', priority = '', status) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
  }

  toggleStatus() {
    this.status = !this.status;
  }

  togglePriority(priority) {
    this.priority = priority;
  }
}