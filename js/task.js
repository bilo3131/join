/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    try {
        const tasksString = await getItem('tasks');
        const contactsString = await getItem('contacts');
        const correctedTasksString = tasksString.replace(/\'/g, '\"');
        const correctedContactsString = contactsString.replace(/\'/g, '\"');
        await parseItems(correctedTasksString, correctedContactsString);
        addTaskEventListener();
        initTask();
    } catch (error) {
        console.error('initialization error: No tasks saved!');
    }
}

/**
 * To parse the loaded elements.
 * @param {String} correctedTasksString To parse tasks.
 * @param {String} correctedContactsString To parse contacts.
 */
async function parseItems(correctedTasksString, correctedContactsString) {
    if (correctedTasksString || correctedContactsString) {
        tasks = JSON.parse(correctedTasksString);
        contacts = JSON.parse(correctedContactsString);
    } else {
        tasks = [];
        contacts = [];
    }
}

/**
 * Sets the event listener for the add task button.
 */
function addTaskEventListener() {
    const addTaskBtn = document.getElementById('add-task'); +
        addTaskBtn?.addEventListener('click', addTask);
}

init();