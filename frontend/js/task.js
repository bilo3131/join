async function init() {
    contacts = await getItem(CONTACTS_KEY) || [];
    tasks = await getItem(TASKS_KEY) || [];
    userCategories = await getItem(CATEGORY_KEY) || [];
    highlightSection('task-desktop', 'task-mobile');
    addTaskEventListener();
    initTask();  
}

function addTaskEventListener() {
    const addTaskBtn = document.getElementById('add-task'); +
        addTaskBtn?.addEventListener('click', addTask);
}

init();