/**
 * Initial function that gets executed after the document has loaded.
 */
async function init() {
    const tasksString = await getItem('tasks');
    const correctedTasksString = tasksString.replace(/\'/g, '\"');
    const correctedTasksJSON = correctedTasksString.replace(/False/g, 'false').replace(/True/g, 'true');
    if (correctedTasksJSON) {
        tasks = JSON.parse(correctedTasksJSON);
    } else {
        tasks = [];
    }
    setTaskNumbers();
    setUrgentTasks();
    addTaskEventListener();
}

/**
 * To greet the logged in user in the correct form based on the current time.
 */
function greetingUser() {
    let greetSection = document.getElementById('greeting');
    let greet = getGreeting();
    let greetUser = getUserName();
    greetSection.innerHTML = greetHTML(greet, greetUser);
}

/**
 * Greet the User who is logged in.
 * @param {String} greet The correct form of the greet based on the current time.
 * @param {String} greetUser The name of the user who should be greet.
 * @returns The HTML part of the greeting.
 */
function greetHTML(greet, greetUser) {
    return /*html*/ `
        <span class="txt-h2">Good ${greet}, <p class="greeting-name">${greetUser}</p></span>
    `;
}

/**
 * Get the saved first name from the LocalStorage.
 * @returns The first name of the logged in user.
 */
function getUserName() {
    let userName = localStorage.getItem('loggedInUser');
    return userName;
}

/**
 * Get the greeting by targeting the current hour.
 * @returns The correct greet based on the current time.
 */
function getGreeting() {
    const d = new Date();
    let time = d.getHours();
    if (time < 13 && time > 5) {
        return 'morning';
    } else if (time < 18 && time > 12) {
        return 'afternoon';
    } else if (time < 22 && time > 17) {
        return 'evening';
    } else {
        return 'night'
    }
}

/**
 * Sets event listener to redirect to the board when you click on a box.
 */
function addTaskEventListener() {
    const taskBoxes = document.querySelectorAll('.box');
    taskBoxes.forEach(box => {
        box.addEventListener('click', () => window.location.href = './board.html');
    });
}

/**
 * Sets the number of the display element for the corresponding task type.
 */
function setTaskNumbers() {
    const tasksEl = document.getElementById('tasks');
    const toDoEl = document.getElementById('to-do');
    const inProgressEl = document.getElementById('in-progress');
    const awaitingEl = document.getElementById('awaiting');
    const doneEl = document.getElementById('done');
    const numTasks = countTasks();

    tasksEl.innerHTML = tasks.length;
    toDoEl.innerHTML = numTasks.toDo;
    inProgressEl.innerHTML = numTasks.inProgress;
    awaitingEl.innerHTML = numTasks.awaiting;
    doneEl.innerHTML = numTasks.done;
}

/**
 * Counts the tasks for each task status.
 * @returns Object with counted tasks.
 */
function countTasks() {
    const numTasks = {
        toDo: 0,
        inProgress: 0,
        awaiting: 0,
        done: 0
    }
    setValue(numTasks);
    return numTasks;
}

/**
 * Count tasks, which are saved in the respective category.
 * @param {JSON} numTasks Counter for tasks.
 */
function setValue(numTasks) {
    tasks.forEach(task => {
        switch (task.status) {
            case 'todo':
                numTasks.toDo += 1;
                break;
            case 'progress':
                numTasks.inProgress += 1;
                break;
            case 'awaiting':
                numTasks.awaiting += 1;
                break;
            case 'done':
                numTasks.done += 1;
                break;
        }
    });
}

/**
 * Sets the number and date of the display element for the urgent tasks.
 */
function setUrgentTasks() {
    const urgentEl = document.getElementById('urgent');
    const urgentDateEl = document.getElementById('urgent-date');
    const urgentTasks = getUrgentTasks();

    urgentEl.innerHTML = urgentTasks.length;

    if (urgentTasks.length > 0) {
        const upcomingDeadline = getUpcomingDeadline(urgentTasks);
        urgentDateEl.innerHTML = formatDate(upcomingDeadline);
    }
}

/**
 * Returns an array of the filtered urgent tasks.
 * @returns Array of urgent tasks.
 */
function getUrgentTasks() {
    return tasks.filter(task => task.priority === 'urgent');
}

/**
 * Sorts the urgent task by date and returns the date of the most urgent task.
 * @param {Array} urgentTasks Array of urgent tasks.
 * @returns Date string of the umpcoming deadline.
 */
function getUpcomingDeadline(urgentTasks) {
    return urgentTasks.sort((taskA, taskB) => taskA.date.localeCompare(taskB.date))[0].date;
}

init();