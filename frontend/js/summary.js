async function init() {
    const summary = await getItem(SUMMARY_KEY);
    
    highlightSection('summary-desktop', 'summary-mobile')
    
    setNumbers(summary);
}

function greetingUser() {
    let greetSection = document.getElementById('greeting');
    let greet = getGreeting();
    let greetUser = getUserName();
    greetSection.innerHTML = greetHTML(greet, greetUser);
}

function greetHTML(greet, greetUser) {
    return /*html*/ `
        <span class="txt-h2">Good ${greet}, <p class="greeting-name">${greetUser}</p></span>
    `;
}

function getUserName() {
    let userName = localStorage.getItem('loggedInUser');
    return userName;
}

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

function addTaskEventListener() {
    const taskBoxes = document.querySelectorAll('.box');
    taskBoxes.forEach(box => {
        box.addEventListener('click', () => window.location.href = './board.html');
    });
}

async function setNumbers(summaryData) {
    const tasksEl = document.getElementById('tasks');
    const toDoEl = document.getElementById('to-do');
    const inProgressEl = document.getElementById('in-progress');
    const awaitingEl = document.getElementById('awaiting');
    const urgentEl = document.getElementById('urgent');
    const doneEl = document.getElementById('done');
    const deadlineEl = document.getElementById('urgent-date');

    tasksEl.innerHTML = summaryData.total_tasks;
    toDoEl.innerHTML = summaryData.tasks_to_do;
    inProgressEl.innerHTML = summaryData.tasks_in_progress;
    awaitingEl.innerHTML = summaryData.tasks_awaiting_feedback;
    doneEl.innerHTML = summaryData.tasks_done;
    urgentEl.innerHTML = summaryData.urgent_tasks;
    if (summaryData.upcoming_deadline) {
        deadlineEl.innerHTML = summaryData.upcoming_deadline;
    }
}

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

function setValue(numTasks) {
    tasks.forEach(task => {
        switch (task.process) {
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

init();