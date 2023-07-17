/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    const contactsString = await getItem('contacts');
    const tasksString = await getItem('tasks');
    const correctedTasksString = tasksString.replace(/\'/g, '\"');
    const correctedContactsString = contactsString.replace(/\'/g, '\"');
    const correctedTasksJSON = correctedTasksString.replace(/False/g, 'false').replace(/True/g, 'true');
    await parseItems(correctedTasksJSON, correctedContactsString);
    addTaskEventListener();
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
 * Sets the event listener for the add task button.
 */
function addTaskEventListener() {
    const addTaskBtn = document.getElementById('add-task'); +
        addTaskBtn?.addEventListener('click', addTask);
}

init();