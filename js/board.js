/**
 * Initial function that gets executed after the document is loaded.
 */
async function initBoard() {
    const tasksString = await getItem('tasks');
    const contactsString = await getItem('contacts');
    const correctedTasksString = tasksString.replace(/\'/g, '\"');
    const correctedContactsString = contactsString.replace(/\'/g, '\"');
    const correctedTasksJSON = correctedTasksString.replace(/False/g, 'false').replace(/True/g, 'true');
    await parseItems(correctedTasksJSON, correctedContactsString);
    renderTaskItems(tasks);
    addSearchBarEventListener();
    addNewTaskButtonEventListener();
    addModalCloseEventListener();
    initTask();
}

/**
 * To parse the loaded elements.
 * @param {String} correctedTasksString To parse tasks.
 * @param {String} correctedContactsString To parse contacts.
 */
async function parseItems(correctedTasksString, correctedContactsString) {
    if (correctedTasksString || correctedContactsString) {
        contacts = await (JSON.parse(correctedContactsString));
        tasks = await (JSON.parse(correctedTasksString));
    } else {
        tasks = [];
        contacts = [];
    }
}

/**
 * Filters the tasks array with the given promt and return a new array that contains the filtered tasks.
 * @param {String} searchBarInp Search input.
 * @returns Filtered tasks array.
 */
function filterTasks(searchBarInp) {
    const filteredTasks = tasks.filter(task => {
        const taskTitle = task.title.toLowerCase();
        const taskDescription = task.description.toLowerCase();
        const searchInput = searchBarInp.toLowerCase();
        return taskTitle.includes(searchInput) || taskDescription.includes(searchInput);
    });
    return filteredTasks;
}

/**
 * Updates the task in the database.
 * @param {HTMLElement} item Board item.
 */
async function updateItem(item) {
    const task = tasks.find(task => task.id === item.dataset.id);
    console.log(item);

    task.status = item.parentElement.dataset.category;
    await setItem('tasks', tasks);
}

/**
 * Renders the tasks in the correct board column.
 * @param {array} tasksArr Array of task objects.
 */
function renderTaskItems(tasksArr) {
    const toDoEl = document.getElementById('todo');
    const inProgressEl = document.getElementById('in-progress');
    const awaitingFeedbackEl = document.getElementById('awaiting-feedback');
    const doneEl = document.getElementById('done');
    clearElementsInnerHTML(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl);
    setTaskStatus(tasksArr, toDoEl, inProgressEl, awaitingFeedbackEl, doneEl)
    addDragItemEventListener();
    addDragContainerEventListener();
    addNewTaskEventListener();
}

/**
 * Set the status of the tasks.
 * @param {HTMLElement} toDoEl Connected HTML-Elements.
 * @param {HTMLElement} inProgressEl Connected HTML-Elements.
 * @param {HTMLElement} awaitingFeedbackEl Connected HTML-Elements.
 * @param {HTMLElement} doneEl Connected HTML-Elements.
 * @param {HTMLElement} tasksArr Connected HTML-Elements.
 */
function setTaskStatus(tasksArr, toDoEl, inProgressEl, awaitingFeedbackEl, doneEl) {
    for (let task of tasksArr) {
        const assignees = renderTaskAssignees(task);
        const taskProgress = getTaskProgress(task);
        switch (task.status) {
            case 'todo':
                toDoEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress);
                break;
            case 'progress':
                inProgressEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress);
                break;
            case 'awaiting':
                awaitingFeedbackEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress);
                break;
            case 'done':
                doneEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress);
                break;
            default:
                toDoEl.innerHTML += taskItemHTMLTemp(task, assignees, taskProgress);
        }
    }
}

/**
 * Calculates the progress of the subtasks.
 * @param {object} task Task object.
 * @returns HTML progress bar.
 */
function getTaskProgress(task) {
    const totalSubtasks = task.subtasks.length;
    const completedSubtasks = task.subtasks.filter(subtask => subtask.isChecked === true).length;
    const subtaskProgress = ((completedSubtasks / totalSubtasks) * 100).toFixed(2);

    if (totalSubtasks === 0) { return '' }
    return subtaskProgressHTMLTemp(subtaskProgress, totalSubtasks, completedSubtasks);
}

/**
 * Clears the column elements and renders the headers.
 * @param {HTMLElement} toDoEl To do col element.
 * @param {HTMLElement} inProgressEl In progress col element.
 * @param {HTMLElement} awaitingFeedbackEl Awaiting feedback col element.
 * @param {HTMLElement} doneEl Done col element.
 */
function clearElementsInnerHTML(toDoEl, inProgressEl, awaitingFeedbackEl, doneEl) {
    toDoEl.innerHTML = taskColHeaderTemp('To Do', 'todo-btn');
    inProgressEl.innerHTML = taskColHeaderTemp('In Progress', 'progress-btn');
    awaitingFeedbackEl.innerHTML = taskColHeaderTemp('Awaiting Feedback', 'awaiting-btn');
    doneEl.innerHTML = taskColHeaderTemp('Done', 'done-btn');
}

/**
 * Renders the assignees of the board object.
 * @param {object} task Task object.
 * @returns String with rendered assignees.
 */
function renderTaskAssignees(task) {
    const assignees = task.assignees;
    let assigneesHTML = '';

    for (let i = 0; i < assignees.length; i++) {
        const contact = contacts.find(contact => contact.id === assignees[i]);
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

/**
 * Removes the assignee from a task.
 * @param {object} task Task object.
 * @param {string} assignees Assignee HTML template string.
 */
async function removeAssignee(task, assignee) {
    const assigneeIndex = task.assignees.indexOf(assignee);
    task.assignees.splice(assigneeIndex, 1);
    await setItem('tasks', tasks);
}

/**
 * Edits the task with the given id and saves it to the database.
 * @param {string} id Id of the task.
 */
function openEditTaskModal(id) {
    const modal = document.getElementById('modal');
    const taskForm = document.getElementById('add-task-form');
    const editTask = tasks.find(task => task.id === id);

    modal.close();
    uncheckAssignees();
    prefillTaskForm(editTask, id);
    adjustModal('edit', id);
    renderAssigneesBubbles();
    clearSubtaskItemContainer();
    renderEditSubtasks(editTask);
    taskForm.showModal();
}

/**
 * Uncheck all selected assignees.
 */
function uncheckAssignees() {
    const selectedAssignees = document.querySelectorAll('#assignee-container input[type="checkbox"]:checked');

    selectedAssignees.forEach(assignee => {
        assignee.checked = false;
    })
}

/**
 * Clears the subtask board item container.
 */
function clearSubtaskItemContainer() {
    const subtaskItemContainer = document.getElementById('subtask-item-container');

    subtaskItemContainer.innerHTML = '';
}

/**
 * Renders the subtask to the edit modal.
 * @param {object} task Task object.
 */
function renderEditSubtasks(task) {
    let subtaskContainerEl = document.getElementById('subtask-container');
    subtaskContainerEl.innerHTML = '';
    task.subtasks.forEach(subtask => {
        subtaskContainerEl.innerHTML += subtaskEditHTMLTemp(subtask.title, subtask.id, subtask.isChecked);
    })
}

/**
 * Updates the subtask in the database.
 * @param {string} taskId Id of the task.
 * @param {string} subtaskId Id of the subtask.
 */
async function updateSubtasks(taskId, subtaskId) {
    const task = tasks.find(task => task.id === taskId);
    const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
    const subtaskIsChecked = document.getElementById(subtaskId).checked;
    subtask.isChecked = subtaskIsChecked;
    await setItem('tasks', tasks);
    renderTaskItems(tasks);
}

/**
 * Prefills the input field when a task gets edited.
 * @param {object} task Task object.
 */
function prefillTaskForm(task) {
    const titleEl = document.getElementById('title');
    const descriptionEl = document.getElementById('description');
    const categoryEl = document.getElementById('category');
    const dateEl = document.getElementById('date');
    const priority = document.getElementById(`${task.priority}`);
    titleEl.value = task.title;
    descriptionEl.value = task.description;
    categoryEl.value = task.category;
    dateEl.value = task.date;
    priority.checked = true;
    task.assignees.forEach(assignee => {
        document.getElementById(assignee).checked = true;
    });
}

/**
 * Adjusts the modal to the corresponding action.
 * @param {string} type Type of action that should be performed.
 * @param {*} id Id of the task.
 */
function adjustModal(type, id) {
    const modalTitle = document.getElementById('modal-title');
    const addTaskBtn = document.getElementById('add-task');

    modalTitle.innerHTML = type === 'add' ? 'Add Task' : 'Edit Task';
    addTaskBtn.innerHTML = type === 'add' ? 'Create Task' : 'Save Task';
    addTaskBtn.innerHTML += '<img src="./assets/icons/check_white.svg" class="btn-icon">';
    addTaskBtn.onclick = type === 'add' ? addTask : () => editTask(id);
    type === 'add' ? addTaskBtn.removeEventListener('click', () => editTask(id)) : addTaskBtn.removeEventListener('click', addTask)
}

/**
 * Edits the task and stores it in the database.
 * @param {string} id Id of the task.
 */
function editTask(id) {
    const taskForm = document.getElementById('add-task-form');
    const assignees = [];
    const assigneeInp = document.querySelectorAll('.assignee input[type="checkbox"]:checked');
    assigneeInp.forEach(assignee => assignees.push(assignee.value));

    if (isInputValid(assignees)) {
        updateTask(id);
        taskForm.close();
        setItem('tasks', tasks);
        renderTaskItems(tasks);
    }
}

/**
 * Updates the edited task in the local database.
 * @param {String} id Id of the task.
 */
function updateTask(id) {
    let updatedTask = tasks.find(task => task.id === id);
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

/**
 * Set the updated tasks on the page.
 */
function setUpdatedTasks(id, updatedTask, titleInp, descriptionInp, categoryInp, assignees, dateInp, priority) {
    updatedTask.id = id;
    updatedTask.title = titleInp.value;
    updatedTask.description = descriptionInp.value;
    updatedTask.category = categoryInp.value;
    updatedTask.assignees = assignees;
    updatedTask.date = dateInp.value;
    updatedTask.priority = priority;
    updatedTask.status = updatedTask.status;
    updatedTask.subtasks = getSubtasks();
}

/**
 * Deletes the task with the given id from the database.
 * @param {string} id Id of the task.
 */
function deleteTask(id) {
    const modal = document.getElementById('modal');
    const delTask = tasks.find(task => task.id === id);
    const delTaskIndex = tasks.indexOf(delTask);
    tasks.splice(delTaskIndex, 1);
    setItem('tasks', tasks);
    renderTaskItems(tasks);
    notify('Successfully deleted!');
    modal.close();
}

/**
 * Gets the color of the category element.
 * @param {object} task Task object.
 * @returns String of hex color.
 */
function getCategoryColor(task) {
    switch (task.category) {
        case 'Accounting/Finance':
            return '#800000';
        case 'Research':
            return '#803100';
        case 'Management':
            return '#807500';
        case 'IT and EDP':
            return '#4a8000';
        case 'Customer Service':
            return '#00800f';
        case 'Marketing':
            return '#008057';
        case 'Human Resource':
            return '#005e80';
        case 'Production':
            return '#002080';
        case 'Sales':
            return '#370080';
        case 'Legal':
            return '#6a0080';
        case 'Backoffice':
            return '#80004f';
    }
}

/**
 * For moving the task in the next or previous category
 * @param {DirectionSetting} direction Check if clicked up or down.
 * @param {*} id The ID of the respective task
 */
function moveTask(direction, id) {
    let categoryArray = ['todo', 'progress', 'awaiting', 'done'];
    const move = tasks.find(task => task.id === id);
    for (let i = 0; i < categoryArray.length; i++) {
        if (categoryArray[i] == move.status) {
            if (i + direction < 0) {
                i = 4;
            } else if (i + direction >= categoryArray.length) {
                i = -1;
            }
            moveAndSave(categoryArray, move, direction, i);
            break;
        }
    }
}

/**
 * Move and save the task in the online storage.
 * @param {*} categoryArray Available categories.
 * @param {*} move Task to move.
 * @param {*} direction Check if clicked up or down.
 * @param {*} i Index of the current category.
 */
function moveAndSave(categoryArray, move, direction, i) {
    move.status = categoryArray[i + direction];
    setItem('tasks', tasks);
    renderTaskItems(tasks);
}

initBoard();