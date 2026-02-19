let loggedInUserName;

/**
 * Locates to the page as a guest
 */
function guestLogin() {
    loggedInUserName = 'Guest';
    localStorage.setItem('loggedInUser', loggedInUserName);
    window.location.href = 'summary.html?msg=guest login';
    saveData();
}

/**
 * Clears login error state when user starts typing
 */
function clearLoginError() {
    loginMail.style.borderColor = '';
    loginPassword.style.borderColor = '';
    const loginFault = document.getElementById('loginFault');
    if (loginFault) loginFault.classList.remove('msg-animation');
}

/**
 * If there ar not correct the bordercolor will be turnd red.
 */
async function login() {
    try {
        const data = await setItem(LOGIN_KEY, {
            username: loginMail.value,
            password: loginPassword.value,
        });
        loggedInUserName = data.first_name
            ? `${data.first_name} ${data.last_name || ''}`.trim()
            : (data.email || data.username || 'User');
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('loggedInUser', loggedInUserName);
        saveData();
        window.location.href = `summary.html?msg=${encodeURIComponent(loggedInUserName)} logged in`;
    } catch (e) {
        loginPassword.style.borderColor = 'red';
        loginMail.style.borderColor = 'red';
        const loginFault = document.getElementById('loginFault');
        if (loginFault) {
            loginFault.classList.remove('msg-animation');
            void loginFault.offsetWidth;
            loginFault.classList.add('msg-animation');
        }
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