async function init() {
    const summary = await getItem(SUMMARY_KEY);

    if (typeof navigationReady !== 'undefined') await navigationReady;
    highlightSection('summary-desktop', 'summary-mobile');
    initBoardNavigationListeners();
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
    // Try localStorage first
    let userName = localStorage.getItem('loggedInUser');
    if (userName && userName !== 'undefined' && userName !== 'null') {
        return userName;
    }
    // Fallback: extract from URL param ?msg=FirstName LastName logged in
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    if (msg && msg !== 'guest login') {
        const name = msg.replace(' logged in', '').trim();
        if (name) {
            localStorage.setItem('loggedInUser', name);
            return name;
        }
    }
    return localStorage.getItem('loggedInUser') || 'User';
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

function initBoardNavigationListeners() {
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
        const [year, month, day] = summaryData.upcoming_deadline.split('-');
        deadlineEl.innerHTML = `${day}.${month}.${year}`;
    }
}

init();