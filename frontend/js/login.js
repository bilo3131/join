async function login() {
    const response = await setItem('auth/login/', {
        username: loginMail.value,
        password: loginPassword.value,
    }, 'POST');

    if (response?.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('loggedInUser', `${response.first_name} ${response.last_name}`);
        saveData();
        window.location.href = 'summary.html';
    } else {
        loginPassword.style.borderColor = 'red';
    }
}

function guestLogin() {
    localStorage.setItem('loggedInUser', 'Guest');
    window.location.href = 'summary.html';
}

function saveData() {
    if (checkbox.checked) {
        localStorage.setItem('JoinEmail', loginMail.value);
        localStorage.setItem('JoinPassword', loginPassword.value);
    }
}

function loadData() {
    loginMail.value = localStorage.getItem('JoinEmail') || '';
    loginPassword.value = localStorage.getItem('JoinPassword') || '';
}
