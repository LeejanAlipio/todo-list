export default class Todo {
  constructor({title, description = '', dueDate = '', priority = '', status, id = null}) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
    this.id = id || crypto.randomUUID();
  }
  
  toggleStatus() {
    this.status = !this.status;
  }
  
  togglePriority(priority) {
    this.priority = priority;
  }
}