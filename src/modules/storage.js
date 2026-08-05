import Project, { addProject, clearProjects, getProjectList } from "./project.js";

const STORAGE_KEY = "todo-list-projects";

export const saveProjects = () => {
  const data = getProjectList().map(project => ({
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
      return false;
    }

    clearProjects();

    data.forEach((projectData) => {
      const project = new Project(projectData.name, projectData.description);
      projectData.projectTasks?.forEach((taskData) => {
        project.addTodo(taskData);
      });
      addProject(project);
    });

    return true;
  } catch {
    return false;
  }
};