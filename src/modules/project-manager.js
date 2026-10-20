import Project from "./project.js";

class ProjectManager {
  constructor() {
    this.projectList = [];
  }

  addProject(project) {
    this.projectList.push(project);
  }

  getProjectList() {
    return [...this.projectList];
  }

  clearProjects() {
    this.projectList = [];
  }

  createDefaultProject() {
    if (this.projectList.length === 0) {
      const defaultProject = new Project('Default', 'Default Project');
      this.projectList.push(defaultProject);
    }
  }
}

export const projectManager = new ProjectManager();