import "./styles.css";
import Project, { getProjectList, createDefaultProject, addProject, loadProjects, saveProjects } from "./modules/project.js";

if (!loadProjects()) {
  createDefaultProject();
}

const state = {
  activeProject: null,
  taskBeingEdited: null,
}

const getActiveProject = () => state.activeProject || getProjectList()[0];

const setActiveProject = (project) => {
  state.activeProject = project;
  renderProjects();
  renderTasks();
  updateStats();
}

const uiElements = {
  taskDialog: document.querySelector('.task-dialog'),
  taskForm: document.querySelector('#task-form'),
  taskTitleInput: document.querySelector('#title'),
  taskDescriptionInput: document.querySelector('#description'),
  taskDueDateInput: document.querySelector('#due-date'),
  taskPriorityInput: document.querySelector('#priority'),
  projectDialog: document.querySelector('.project-dialog'),
  projectForm: document.querySelector('#project-form'),
  projectNameInput: document.querySelector('#project-name'),
  projectDescriptionInput: document.querySelector('#project-description'),
  projectList: document.querySelector('#project-list'),
  taskNumber: document.querySelector('.task-number'),
  completedNumber: document.querySelector('.completed-number'),
  inProgressNumber: document.querySelector('.in-progress-number'),
  contentTasks: document.querySelector('.content-tasks'),
}

const uiActions = {
  addProjectBtn: document.querySelector('.add-project-btn'),
  addTaskBtn: document.querySelector('.add-task-btn'),
  cancelTaskBtn: document.querySelector('.task-dialog .cancel-btn'),
  cancelProjectBtn: document.querySelector('.project-dialog .cancel-btn'),
}

const renderProjects = () => {
  uiElements.projectList.innerHTML = '';

  getProjectList().forEach(projectData => {
    const projectItem = document.createElement('li');
    projectItem.classList.add('project-item');

    const projectButton = document.createElement('button');
    projectButton.classList.add('project-name-btn');
    projectButton.type = 'button';
    projectButton.textContent = projectData.name;
    projectButton.addEventListener('click', () => {
      setActiveProject(projectData);
    });

    if (getActiveProject() === projectData) {
      projectItem.classList.add('active');
    }

    projectItem.appendChild(projectButton);
    uiElements.projectList.appendChild(projectItem);
  });
};

renderProjects();

const renderTasks = () => {
  const projectTasks = getActiveProject().getProjectTasks();
  
  uiElements.contentTasks.innerHTML = '';

  projectTasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.classList.toggle('finish-task', task.status)

    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container')

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.status;
    checkbox.classList.add('checkbox')
    checkbox.addEventListener('change', () => {
      task.toggleStatus();
      saveProjects();
      renderTasks();
      updateStats();
    })

    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info')

    const taskInfoHeader = document.createElement('div');
    taskInfoHeader.classList.add('task-info-header');

    const title = document.createElement('p');
    title.textContent = task.title;
    title.classList.add('title');

    const priority = document.createElement('span');
    priority.textContent = task.priority;
    switch (priority.textContent.toLowerCase()) {
      case 'low':
        priority.classList.add('priority', 'low-priority');
        break;
      case 'medium':
        priority.classList.add('priority', 'medium-priority');
        break;
      case 'high':
        priority.classList.add('priority', 'high-priority');
        break;
    }

    const dueDate = document.createElement('p');
    dueDate.textContent = task.dueDate;
    dueDate.classList.add('due-date');

    taskInfoHeader.append(title, priority);

    taskInfo.append(taskInfoHeader, dueDate);

    taskContainer.append(checkbox, taskInfo);

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('btn', 'edit-btn');
    editBtn.type = 'button';
    editBtn.addEventListener('click', () => {
      state.taskBeingEdited = task;
      uiElements.taskTitleInput.value = task.title || '';
      uiElements.taskDescriptionInput.value = task.description || '';
      uiElements.taskDueDateInput.value = task.dueDate || '';
      uiElements.taskPriorityInput.value = task.priority || 'low';
      uiElements.taskDialog.showModal();
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Remove';
    delBtn.classList.add('btn', 'delete-btn');
    delBtn.type = 'button';
    delBtn.addEventListener('click', () => {
      getActiveProject().removeTodo(task.id);
      saveProjects();
      renderTasks();
      updateStats();
    })

    btnContainer.append(editBtn, delBtn)

    taskCard.append(taskContainer, btnContainer);
    uiElements.contentTasks.appendChild(taskCard);
  });
};

renderTasks();

const updateStats = () => {
  const projectTasks = getActiveProject().getProjectTasks();

  uiElements.taskNumber.textContent = projectTasks.filter(task => !task.status).length;
  uiElements.completedNumber.textContent = projectTasks.filter(task => task.status).length;
  uiElements.inProgressNumber.textContent = projectTasks.filter(task => !task.status).length;
}

updateStats();

const bindUiActions = () => {
  uiActions.addProjectBtn.addEventListener('click', () => {
    uiElements.projectDialog.showModal();
  });

  uiActions.cancelProjectBtn.addEventListener('click', () => {
    uiElements.projectDialog.close();
  });

  uiActions.addTaskBtn.addEventListener('click', () => {
    state.taskBeingEdited = null;
    uiElements.taskForm.reset();
    uiElements.taskDialog.showModal();
  });

  uiActions.cancelTaskBtn.addEventListener('click', () => {
    state.taskBeingEdited = null;
    uiElements.taskForm.reset();
    uiElements.taskDialog.close();
  });

  uiElements.projectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newProject = new Project(
      uiElements.projectNameInput.value.trim(), 
      uiElements.projectDescriptionInput.value.trim()
    );

    if (getProjectList().some(project => project.name === newProject.name)) return;

    addProject(newProject);
    saveProjects();
    
    state.activeProject = newProject;

    renderProjects();
    renderTasks();
    updateStats();

    uiElements.projectForm.reset();
    uiElements.projectDialog.close();
  });

  uiElements.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (state.taskBeingEdited) {
      state.taskBeingEdited.title = uiElements.taskTitleInput.value.trim();
      state.taskBeingEdited.description = uiElements.taskDescriptionInput.value.trim();
      state.taskBeingEdited.dueDate = uiElements.taskDueDateInput.value;
      state.taskBeingEdited.priority = uiElements.taskPriorityInput.value;
      state.taskBeingEdited = null;
    } else {
      getActiveProject().addTodo(
        uiElements.taskTitleInput.value.trim(),
        uiElements.taskDescriptionInput.value.trim(),
        uiElements.taskDueDateInput.value,
        uiElements.taskPriorityInput.value,
        false,
      );
    }

    saveProjects();
    renderTasks();
    updateStats();
    uiElements.taskForm.reset();
    uiElements.taskDialog.close();
  });
}

bindUiActions()