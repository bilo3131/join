async function init() {
    tasks = await getItem(TASKS_KEY);
    contacts = await getItem(CONTACTS_KEY);
    userCategories = await getItem(CATEGORY_KEY);
    renderTaskItems();
    addSearchBarEventListener();
    addNewTaskButtonEventListener();
    addModalCloseEventListener();
    highlightSection('board-desktop', 'board-mobile');
    initTask();
}

function renderTaskItems(renderedTasks = undefined) {
    const toDoEl = document.getElementById('todo');
    const inProgressEl = document.getElementById('in-progress');
    const awaitingFeedbackEl = document.getElementById('awaiting-feedback');
    const doneEl = document.getElementById('done');
    clearElementsInnerHTML(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl);
    setTaskStatus(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl, renderedTasks);
    addDragItemEventListener();
    addDragContainerEventListener();
    addNewTaskEventListener();
}

function clearElementsInnerHTML(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl) {
    toDoEl.innerHTML = taskColHeaderTemp('To Do', 'todo-btn');
    inProgressEl.innerHTML = taskColHeaderTemp('In Progress', 'progress-btn');
    awaitingFeedbackEl.innerHTML = taskColHeaderTemp('Awaiting Feedback', 'awaiting-btn');
    doneEl.innerHTML = taskColHeaderTemp('Done', 'done-btn');
}

function setTaskStatus(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl, renderedTasks = undefined) {
    for (let task of renderedTasks || tasks) {
        const assignees = renderTaskAssignees(task);        
        const taskProgress = getTaskProgress(task);        
        const category = userCategories.find(category => category.id == task.category || category.name == task.category);
        
        switch (task.process) {
            case 'todo':
                toDoEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress, category);
                break;
            case 'in_progress':
                inProgressEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress, category);
                break;
            case 'awaiting_feedback':
                awaitingFeedbackEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress, category);
                break;
            case 'done':
                doneEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress, category);
                break;
            default:
                toDoEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress, category);
        }
    }
}

function filterTasks(searchBarInp) {
    const filteredTasks = tasks.filter(task => {
        const taskTitle = task.title.toLowerCase();
        const taskDescription = task.description.toLowerCase();
        const searchInput = searchBarInp.toLowerCase();
        return taskTitle.includes(searchInput) || taskDescription.includes(searchInput);
    });
    return filteredTasks;
}

function openEditTaskModal(id) {
    const modal = document.getElementById('modal');
    const taskForm = document.getElementById('add-task-form');
    const editTask = tasks.find(task => task.id == id);
    const category = userCategories.find(c => c.id == editTask.category || c.name == editTask.category);
    modal.close();
    uncheckAssignees();
    prefillTaskForm(editTask, category);
    adjustModal('edit', id);
    renderAssigneesBubbles();
    clearSubtaskItemContainer();
    renderEditSubtasks(editTask);
    taskForm.showModal();
}

function moveTask(direction, id) {
    let categoryArray = ['todo', 'in_progress', 'awaiting_feedback', 'done'];
    const task = tasks.find(task => task.id == id);
    
    for (let i = 0; i < categoryArray.length; i++) {
        if (categoryArray[i] == task.process) {
            if (i + direction < 0) {
                i = 4;
            } else if (i + direction >= categoryArray.length) {
                i = -1;
            }
            moveAndSave(categoryArray, task, direction, i);
            break;
        }
    }
}

function moveAndSave(categoryArray, task, direction, i) {
    task.process = categoryArray[i + direction];    
    setItem(TASKS_KEY + task.id + '/', task, 'PUT');
    modal.close();
    renderTaskItems();
}

async function updateProgress(item) {
    const task = tasks.find(task => task.id == item.dataset.id);    
    task.process = item.parentElement.dataset.category;    
    await setItem(TASKS_KEY + task.id + '/', task, 'PUT');
}

function getTaskProgress(task) {
    const totalSubtasks = task.subtasks.length;    
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed == true).length;
    const subtaskProgress = ((completedSubtasks / totalSubtasks) * 100).toFixed(2);
    if (totalSubtasks === 0) { return '' }
    return subtaskProgressHTMLTemp(subtaskProgress, totalSubtasks, completedSubtasks);
}

function deleteTask(id) {
    const modal = document.getElementById('modal');
    const delTask = tasks.find(task => task.id == id);
    const delTaskIndex = tasks.indexOf(delTask);
    tasks.splice(delTaskIndex, 1);
    setItem(TASKS_KEY + id + '/', null, 'DELETE');
    renderTaskItems();
    notify('Successfully deleted!');
    modal.close();
}

function renderTaskAssignees(task) {
    const assignees = task.assigned_to;      
    let assigneesHTML = '';
    for (let i = 0; i < assignees.length; i++) {
        const contact = contacts.find(contact => contact.id == assignees[i]);
        if (!contact) { removeAssignee(task, assignees[i]); continue }
        const firstnameChar = contact.firstname.charAt(0).toUpperCase();
        const lastnameChar = contact.lastname.charAt(0).toUpperCase();
        const initials = `${firstnameChar}${lastnameChar}`;
        const assigneeOffset = i * 12;
        if (i == 3) {
            assigneesHTML += assigneeHTMLTemp(`+${assignees.length - i}`, contact.color, assigneeOffset);
            return assigneesHTML;
        } else {
            assigneesHTML += assigneeHTMLTemp(initials, contact.color, assigneeOffset);
        }
    }
    return assigneesHTML;
}

async function removeAssignee(task, assignee) {
    const assigneeIndex = task.assignees.indexOf(assignee);
    task.assignees.splice(assigneeIndex, 1);
    await setItem(TASKS_KEY + task.id + '/', task, 'DELETE');
}

function uncheckAssignees() {
    const selectedAssignees = document.querySelectorAll('#assignee-container input[type="checkbox"]:checked');
    selectedAssignees.forEach(assignee => {
        assignee.checked = false;
    })
}

function clearSubtaskItemContainer() {
    const subtaskItemContainer = document.getElementById('subtask-item-container');
    subtaskItemContainer.innerHTML = '';
}

function renderEditSubtasks(task) {
    let subtaskContainerEl = document.getElementById('subtask-container');
    subtaskContainerEl.innerHTML = '';
    task.subtasks.forEach(subtask => {
        subtaskContainerEl.innerHTML += subtaskEditHTMLTemp(subtask.title, subtask.id, subtask.completed);
    })
}

async function updateSubtasks(taskId, subtaskId) {
    const task = tasks.find(task => task.id == taskId);
    const subtask = task.subtasks.find(subtask => subtask.id == subtaskId);
    const subtaskIsChecked = document.getElementById(subtaskId).checked;
    subtask.completed = subtaskIsChecked;    
    await setItem(TASKS_KEY + taskId + '/', task, 'PUT');
    renderTaskItems();
}

function prefillTaskForm(task, category) {
    const titleEl = getId('title');
    const descriptionEl = document.getElementById('description');
    const categoryEl = document.getElementById('category');
    const dateEl = document.getElementById('date');
    const priority = document.getElementById(`${task.priority}`);
    titleEl.value = task.title;
    descriptionEl.value = task.description;
    categoryEl.value = category.name;
    dateEl.value = task.date;
    priority.checked = true;
    task.assignees.forEach(assignee => {
        document.getElementById(assignee).checked = true;
    });
}

function getId(id) {
    return document.getElementById(id);
}

function adjustModal(type, id = NaN) {
    const modalTitle = document.getElementById('modal-title');
    const addTaskBtn = document.getElementById('add-task');    
    modalTitle.innerHTML = type === 'add' ? 'Add Task' : 'Edit Task';
    addTaskBtn.innerHTML = type === 'add' ? 'Create Task' : 'Save Task';
    addTaskBtn.innerHTML += '<img src="./assets/icons/check_white.svg" class="btn-icon">';
    addTaskBtn.onclick = type === 'add' ? addTask : () => editTask(id);
    type === 'add' ? addTaskBtn.removeEventListener('click', () => editTask(id)) : addTaskBtn.removeEventListener('click', addTask)
}

function editTask(id) {
    const taskForm = document.getElementById('add-task-form');
    const assignees = [];
    const assigneeInp = document.querySelectorAll('.assignee input[type="checkbox"]:checked');
    assigneeInp.forEach(assignee => assignees.push(assignee.value));
    const task = tasks.find(task => task.id == id); 
    if (isInputValid(assignees)) {
        updateTask(id);
        taskForm.close();        
        setItem(TASKS_KEY + id + '/', task, 'PUT');
        renderTaskItems();
    }
}

function updateTask(id) {
    let updatedTask = tasks.find(task => task.id == id);
    const titleInp = document.getElementById('title');
    const descriptionInp = document.getElementById('description');
    const categoryInp = document.getElementById('category');
    const dateInp = document.getElementById('date');
    const priorityInp = document.querySelector('input[name="priority"]:checked');
    const priority = priorityInp != null ? priorityInp.value : 'low';
    const assignees = [];
    const assigneeInp = document.querySelectorAll('.assignee input[type="checkbox"]:checked');
    assigneeInp.forEach(assignee => assignees.push(assignee.value));
    setUpdatedTasks(id, updatedTask, titleInp, descriptionInp, categoryInp, assignees, dateInp, priority);
}

function setUpdatedTasks(id, updatedTask, titleInp, descriptionInp, categoryInp, assignees, dateInp, priority) {
    sentCategory = userCategories.find(category => category.name == categoryInp.value);
    updatedTask.id = id;
    updatedTask.title = titleInp.value;
    updatedTask.description = descriptionInp.value;
    updatedTask.category = sentCategory.id;
    updatedTask.assignees = assignees;
    updatedTask.date = dateInp.value;
    updatedTask.priority = priority;
    updatedTask.process = updatedTask.process;
    updatedTask.subtasks = getSubtasks();    
}

init();