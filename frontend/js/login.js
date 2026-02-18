let loggedInUserName;

/**
 * Locates to the page as a guest
 */
function guestLogin() {
    loggedInUserName = 'Guest';
    window.location.href = 'summary.html?msg=guest login';
    saveData();
}

/**
 * Control if the email and the password are correct and log in
 * If there ar not correct the bordercolor will be turnd red.
 */
async function login() {
    try {
        const data = await setItem(LOGIN_KEY, {
            username: loginMail.value,
            password: loginPassword.value,
        });
        loggedInUserName = data.first_name || data.username;
        localStorage.setItem('authToken', data.token);
        saveData();
        window.location.href = `summary.html?msg=${data.first_name || ''} ${data.last_name || ''} logged in`;
    } catch (e) {
        loginPassword.style.borderColor = 'red';
        loginMail.style.borderColor = 'red';
    }
}

/**
 * Function that saves the userdata in the LocalStorage, if the checkbox is checked
 */
function saveData() {
    if (checkbox.checked) {
        localStorage.setItem('JoinEmail', loginMail.value);
        localStorage.setItem('JoinPassword', loginPassword.value);
        localStorage.setItem('loggedInUser', loggedInUserName);
    }
}

/**
 * Load the saved userdata
 */
function loadData() {
    let savedMail = localStorage.getItem('JoinEmail');
    let savedPassword = localStorage.getItem('JoinPassword');
    loginMail.value = savedMail;
    loginPassword.value = savedPassword;
}