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
function login() {
    let user = users.find(u => u.email == loginMail.value && u.password == loginPassword.value);
    if (user) {
        loggedInUserName = user.firstName;
        window.location.href = `summary.html?msg=${user.firstName} ${user.lastName} logged in`;
    } 
    else {
        loginPassword.style.borderColor = 'red';
    }

    saveData();
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