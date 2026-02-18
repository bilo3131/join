function addNewTaskButtonEventListener() {
    const modalAddTask = document.getElementById('add-task-form');
    const newTaskBtn = document.getElementById('new-task-btn');
    newTaskBtn.addEventListener('click', () => openAddTaskModal('todo', modalAddTask));
}

function openAddTaskModal(status, modal) {
    clearTaskInputFields();
    adjustModal('add');
    renderAssigneesBubbles();
    modal.showModal();
    modal.dataset.status = status;
}

function addModalCloseEventListener() {
    const modalClose = document.getElementById('modal-close');
    const modal = document.getElementById('modal');
    modalClose.addEventListener('click', () => {
        modal.close();
    })
}

function addSearchBarEventListener() {
    const searchBarInp = document.getElementById('search-task');
    searchBarInp.addEventListener('input', () => {
        let filteredTasks = filterTasks(searchBarInp.value);
        renderTaskItems(filteredTasks);
    });
}

function addNewTaskEventListener() {
    const toDoTaskBtn = document.getElementById('todo-btn');
    const inProgressTaskBtn = document.getElementById('progress-btn');
    const awaitingTaskBtn = document.getElementById('awaiting-btn');
    const doneTaskBtn = document.getElementById('done-btn');
    const modalAddTask = document.getElementById('add-task-form');
    const modalTaskClose = document.getElementById('modal-task-close');
    toDoTaskBtn.addEventListener('click', () => openAddTaskModal('todo', modalAddTask));
    inProgressTaskBtn.addEventListener('click', () => openAddTaskModal('progress', modalAddTask));
    awaitingTaskBtn.addEventListener('click', () => openAddTaskModal('awaiting', modalAddTask));
    doneTaskBtn.addEventListener('click', () => openAddTaskModal('done', modalAddTask));
    modalTaskClose.addEventListener('click', () => closeAddTaskModal(modalAddTask));
}

function closeAddTaskModal(modal) {
    modal.close()
}