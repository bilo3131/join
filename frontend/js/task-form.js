function initTask() {
    buttonEventListener();
    renderAssignees();
    setMinTaskDate();
    loadAddedCategories();
}

function buttonEventListener() {
    const clearTaskBtn = document.getElementById('clear-task');
    const assigneeMenu = document.getElementById('assignee');
    const subtaskBtn = document.getElementById('subtask-add');

    assigneeMenu.addEventListener('click', toggleDropdown);
    clearTaskBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        clearInputFields();
    });
    subtaskBtn.addEventListener('click', addSubtaskToTask);
}

function toggleDropdown() {
    const assigneeBackground = document.getElementById('assignee-background');
    const assigneeContainer = document.getElementById('assignee-container');

    assigneeBackground.classList.toggle('d-none'); // toggle statt remove hier
    assigneeContainer.classList.toggle('d-none');  // toggle statt remove hier
}

function clearInputFields() {
    const titleInp = document.getElementById('title');
    const descriptionInp = document.getElementById('description');
    const categoryInp = document.getElementById('category');
    const dateInp = document.getElementById('date');
    const assigneeInp = document.querySelectorAll('input[type="checkbox"]:checked');
    const subtaskContainer = document.getElementById('subtask-container');
    titleInp.value = '';
    descriptionInp.value = '';
    categoryInp.value = '';
    assigneeInp.forEach(assignee => assignee.checked = false);
    dateInp.value = '';
    subtaskContainer.innerHTML = '';
    clearPriority();
}

function clearPriority() {
    const priority = document.getElementById('low');
    priority.checked = true;
}

function renderAssignees() {
    const assigneeContainer = document.getElementById('assignee-container');

    assigneeContainer.innerHTML = '';
    contacts.forEach(contact => {
        
        assigneeContainer.innerHTML += assigneeTemp(contact.id, contact.firstname, contact.lastname);
    });
}

function assigneeTemp(id, firstname, lastname) {    
    return `
        <label for="${id}" class="assignee">${firstname} ${lastname}
            <input type="checkbox" name="${id}" id="${id}" value="${id}" onchange="renderAssigneesBubbles()">
            <span class="checkmark"></span>
        </label>`;
}

function renderAssigneesBubbles() {
    const assigneeBubblesEl = document.getElementById('assignee-bubbles');
    const selectedAssignees = document.querySelectorAll('#assignee-container input[type="checkbox"]:checked');    
    let assigneesHTML = '';
    assigneeBubblesEl.innerHTML = '';

    runThroughAssigneesBubbles(assigneeBubblesEl, selectedAssignees, assigneesHTML);
}

function runThroughAssigneesBubbles(assigneeBubblesEl, selectedAssignees, assigneesHTML) {
    for (let i = 0; i < selectedAssignees.length; i++) {
        const contact = contacts.find(c => c.id == selectedAssignees[i].id);

        const firstnameChar = contact.firstname.charAt(0).toUpperCase();
        const lastnameChar = contact.lastname.charAt(0).toUpperCase();
        const initials = `${firstnameChar}${lastnameChar}`;
        const assigneeOffset = i * 12;

        if (i == 7) {
            assigneesHTML += assigneeHTMLTemp(`+${selectedAssignees.length - i}`, contact.color, assigneeOffset);
            assigneeBubblesEl.innerHTML = assigneesHTML;
            return;
        } else {
            assigneesHTML += assigneeHTMLTemp(initials, contact.color, assigneeOffset);
            assigneeBubblesEl.innerHTML = assigneesHTML;
        }
    }
}

function setMinTaskDate() {
    const date = document.getElementById('date');

    date.min = getCurrentFormattedDate();
}

function getCurrentFormattedDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthTwoDigit = month < 10 ? `0${month}` : month;
    const day = currentDate.getDate();
    const dayTwoDigit = day < 10 ? `0${day}` : day;

    return `${year}-${monthTwoDigit}-${dayTwoDigit}`;
}

function checkCategory() {
    let categories = document.getElementById('category');
    if (categories.value == 'Add new Category') {
        categories.value = '';
        toggleInput();
    }
}

function toggleInput() {
    let inputCategory = document.getElementById('inputfield-category');
    let categories = document.getElementById('category');
    let newCategory = document.getElementById('new-category');
    inputCategory.classList.toggle('d-none');
    categories.classList.toggle('d-none');
    newCategory.value = '';
}

function addCategory() {
    let newCategory = document.getElementById('new-category');

    if (newCategory.value) {
        saveCategory(newCategory.value);
    }
    toggleInput();
}

async function saveCategory(newCategory) {
    const categoryToAdd = {
        name: newCategory,
    }

    await setItem(CATEGORY_KEY, categoryToAdd, 'POST');

    init();

}

function loadAddedCategories() {
    let categories = document.getElementById('category');
    categories.innerHTML = `<option value="" disabled selected hidden>Select task category</option>
                                <option value="Add new Category">Add new Category</option>`;
    for (let i = 0; i < userCategories.length; i++) {
        const category = userCategories[i].name;
        const categoryId = userCategories[i].id;
        categories.innerHTML += addNewCategoryHTML(category, categoryId);
    }
}

function addNewCategoryHTML(newCategory, categoryId) {
    return /*html*/ `
        <option id='${categoryId}'>${newCategory}</option>
    `;
}

function addTask() {
    const createdWithStatus = document.getElementById('add-task-form').dataset.status;   
    const titleInp = document.getElementById('title');
    const descriptionInp = document.getElementById('description');
    const categoryInp = document.getElementById('category').value;
    const dateInp = document.getElementById('date');  
    const priorityInp = document.querySelector('input[name="priority"]:checked');
    const priority = priorityInp != null ? priorityInp.value : 'low';
    const assignees = [];
    const assigneeInp = document.querySelectorAll('#assignee-container input[type="checkbox"]:checked');
    assigneeInp.forEach(assignee => assignees.push(Number(assignee.id)));    

    const subtasks = getSubtasks();
    setTasks(titleInp, descriptionInp, categoryInp, assignees, dateInp, priority, createdWithStatus, subtasks);
}

async function setTasks(titleInp, descriptionInp, categoryInp, assignees, dateInp, priority, createdWithStatus, subtasks) {
    
    const categoryValue = userCategories.find(c => c.name == categoryInp);    
    if (isInputValid(assignees)) {        
        const task = {
            title: titleInp.value,
            description: descriptionInp.value,
            category: categoryValue.id,
            assigned_to: assignees,
            due_date: dateInp.value,
            priority: priority,
            status: createdWithStatus,
            subtasks: subtasks
        };
        
        await storeTasks(task);
    }
}

function isInputValid(assignees) {
    const titleInp = document.getElementById('title');
    const categoryInp = document.getElementById('category');
    const dateInp = document.getElementById('date');
    const assigneeCheck = document.getElementById('assignee-check');
    const isInputValid = titleInp.checkValidity() && categoryInp.checkValidity() && dateInp.checkValidity() && assignees.length > 0;

    
    assigneeCheck.checked = false;
    if (assignees.length == 0) {
        assigneeCheck.reportValidity();
    } else {
        assigneeCheck.checked = true;
    }
    return isInputValid;
}

async function storeTasks(task) {
    tasks.push(task);

    await setItem(TASKS_KEY, task, 'POST');
    clearInputFields();
    window.location.href = './board.html';
}

function getSubtasks() {
    const subtasksEl = document.querySelectorAll('label.subtask');
    const subtaskArr = [];

    subtasksEl.forEach(label => {
        const subtaskTitle = label.innerText;
        const isSubtaskChecked = label.children.namedItem(label.htmlFor).checked;

        subtaskArr.push({
            custom_id: label.htmlFor,
            title: subtaskTitle,
            is_completed: isSubtaskChecked
        });
    });

    return subtaskArr;
}

function addSubtaskToTask() {
    const subtaskInp = document.getElementById('subtask-input');
    const subtaskContainerEl = document.getElementById('subtask-container');
    const inputValue = subtaskInp.value.trim();
    const id = Date.now().toString(36);

    if (inputValue.length > 0) {
        subtaskContainerEl.innerHTML += subtaskEditHTMLTemp(subtaskInp.value, id);
        subtaskInp.value = '';
    }
}

function renderSubtasks(task) {
    let subtasksHTML = '';
     

    task.subtasks.forEach(subtask => {

        subtasksHTML += subtaskHTMLTemp(task.id, subtask.title, subtask.id, subtask.is_completed);
    })

    return subtasksHTML
}

function deleteSubtaskFromTask(id) {

    const subtaskEl = document.getElementById(`subtask-item-${id}`);

    subtaskEl.remove();
}

function assigneeHTMLTemp(initials, color, offset) {
    return (`
        <div class="assignee-task" style="right:${offset}px; background: hsl(${color}, 100%, 30%)">${initials}</div>
    `);
}

function subtaskHTMLTemp(taskId, subtaskText, id, completed = false) {
    return (`
        <div class="d-flex subtask-item" id="subtask-item-${id}" data-id="${id}">
            <label for="${id}" class="subtask">${subtaskText}
                <input type="checkbox" name="${id}" id="${id}" value="${id}" onchange="updateSubtasks('${taskId}', '${id}')" ${completed ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
        </div>
    `);
}

function subtaskEditHTMLTemp(subtaskText, id, completed = false) {
    return (`
        <div class="d-flex subtask-item" id="subtask-item-${id}" data-id="${id}">
            <label for="${id}" class="subtask">${subtaskText}
                <input type="checkbox" name="${id}" id="${id}" value="${id}" ${completed ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <img src="./assets/icons/trash.svg" class="subtask-delete" onclick="deleteSubtaskFromTask('${id}')">
        </div>
    `);
}