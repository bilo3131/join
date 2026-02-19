// -------------------
// Templates
// -------------------

function taskColHeaderTemp(title, id) {
    return (`
        <div class="task-col-header">
            <h5 class="txt-h5">${title}</h5>
            <img src="./assets/icons/task_button.svg" alt="Add Task Icon" class="task-button" id="${id}" draggable="false">
        </div>
    `);
}

function taskItemHTMLTemp(task, assignees, progress, category) {
    return (`
        <div class="task-item" data-id="${task.id}" draggable="true">
            <div class="task-top">
            <div class="category" style="background: hsl(${category.color}, 100%, 30%)">${category.name}</div>
            </div>
            <div>
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
            ${progress}
            <div class="task-footer">
                <div class="assignees">${assignees}</div>
                <div class="d-flex">
                    <img src="./assets/icons/${task.priority}.svg" alt="Priority Icon" class="priority" draggable="false">
                </div>
            </div>
        </div>
    `);
}

function modalItemHTMLTemp(task, category, assignees, subtasks = undefined) {
    let subtaskEl = '<div class="modal-subtask-container subtask-container d-flex-col" id="subtask-item-container"></div>';
    if (subtasks) {
        subtaskEl = `
            <div><b>Subtasks:</b>
                <div class="modal-subtask-container subtask-container d-flex-col" id="subtask-item-container">${subtasks}</div>
            </div>`;
    }
    return (`
        <div class="modal-category" style="background:hsl(${category.color}, 100%, 30%)">${category.name}</div>
        <div>
            <div class="modal-title txt-h4">${task.title}</div>
            <div class="modal-description">${task.description}</div>
        </div>
        <div class="modal-date"><b>Due Date:&nbsp;</b>${formatDate(task.due_date)}</div>
        <div class="modal-priority"><b>Priority:&nbsp;</b>
            <p  style="background: var(--${task.priority})">${task.priority}
                <img src="./assets/icons/${task.priority}_white.svg" draggable="false">
            </p>
        </div>
        <div class="modal-assignees"><b>Assigned to:</b>
            <div class="modal-assignee-container d-flex-col">${assignees}</div>
        </div>
        ${subtaskEl}
        <div class="modal-assignee-bottom">
            <div class="modal-assignee-buttons">
                <button class="btn btn-primary modal-button" id="task-move-up" onclick="moveTask(-1, ${task.id})"> <img class="color-white" src="./assets/icons/dropdown_arrow.svg"> </button>
                <button class="btn btn-primary modal-button" id="task-move-down" onclick="moveTask(+1, ${task.id})"> <img class="color-white" src="./assets/icons/dropdown_arrow.svg"> </button>
            </div>
            <div class="modal-assignee-buttons">
            <button class="btn btn-primary modal-button" id="modal-edit" onclick="openEditTaskModal(${task.id})"><img src="./assets/icons/edit.svg"></button>
            <button class="btn btn-primary modal-button" id="modal-delete" onclick="deleteTask(${task.id})"><img src="./assets/icons/trash_white.svg"></button>
            </div>
        </div>
        `);
}

function modalAssigneHTMLTemp(initials, contact) {
    return (`
        <div class="modal-assignee d-flex">
            <div class="modal-assignee-initials" style="background:hsl(${contact.color}, 100%, 30%)">${initials}</div>
            <div>${contact.firstname} ${contact.lastname}</div>
        </div>
    `);
}

function subtaskProgressHTMLTemp(progress, total, completed) {
    return (`
        <div class="d-flex flex-center">
            <div id="subtask-progress-bar"><div id="subtask-progress" style="width: ${progress}%"></div></div>
            <div>${completed}/${total}</div>
        </div>
    `);
}