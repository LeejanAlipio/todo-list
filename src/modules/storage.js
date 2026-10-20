import Project from './project.js';
import { projectManager } from './project-manager.js';

const STORAGE_KEY = 'todo-list-projects';

export const saveProjects = () => {
  const data = projectManager.getProjectList().map(project => ({
    name: project.name,
    description: project.description,
    projectTasks: project.projectTasks.map(task => ({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      id: task.id,
    })),
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadProjects = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return false;
  }

  try {
    const data = JSON.parse(raw);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data is not an array or it is empty');
    }

    projectManager.clearProjects();

    data.forEach((projectData) => {
      const project = new Project(projectData.name, projectData.description);
      projectData.projectTasks?.forEach((taskData) => {
        project.addTodo(taskData);
      });
      projectManager.addProject(project);
    });

    return true;
  } catch (error) { 
    console.error(error);
    return false;
  }
};