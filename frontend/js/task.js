async function init() {
    [contacts, tasks, userCategories] = await Promise.all([
        getItem(CONTACTS_KEY),
        getItem(TASKS_KEY),
        getItem(CATEGORY_KEY),
    ]);
    await navigationReady;
    highlightSection('task-desktop', 'task-mobile');
    addTaskEventListener();
    initTask();
}

function addTaskEventListener() {
    const addTaskBtn = document.getElementById('add-task');
    addTaskBtn?.addEventListener('click', addTask);
}

init();