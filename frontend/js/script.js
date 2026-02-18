const navigationReady = includeHTML().then(() => logoutModalEventListener());

function highlightSection(desktop, mobile) {
    document.getElementById(desktop)?.classList.add('active');
    document.getElementById(mobile)?.classList.add('active');
}

function getInitials(contact) {
    return `${contact.firstname.charAt(0).toUpperCase()}${contact.lastname.charAt(0).toUpperCase()}`;
}

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
}

async function includeHTML() {
    const includeElements = document.querySelectorAll('[template-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element?.getAttribute("template-html");

        const resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function logoutModalEventListener() {
    const profilePicture = document.getElementById('profile-picture');
    const logoutModal = document.getElementById('logout-modal');

    profilePicture?.addEventListener('click', () => {
        logoutModal?.classList.toggle('d-none');
    });
}

