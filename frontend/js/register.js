/**
 * Function to initial the 'Register' section
 */
async function initRegister() {
    loadUsers();
}

/**
 * Load the userdata from the online-storage
 * @param {JSON} users 
 */
async function loadUsers() {
    users = await getItem(PROFILES_KEY);
}

/**
 * Save the userdata to the online-storage
 */
async function register() {
    registerButton.disabled = true;
    let lastName = username.value.split(',')[0].trim();
    let firstName = username.value.split(',')[1].trim();

    try {
        await setItem(REGISTRATION_KEY, {
            first_name: firstName,
            last_name: lastName,
            email: email.value,
            password: password.value,
            repeated_password: confirmPassword.value,
        });
        sourceToLogin();
    } catch (e) {
        // Backend returned 400 → email already in use or validation error
        registerButton.disabled = false;
        fault.classList.remove('msg-animation');
        void fault.offsetWidth;
        fault.classList.add('msg-animation');
        email.style.borderColor = 'red';
    }
}

/**
 * Resets the error state when the user changes the email input
 */
function checkRegistration() {
    fault.classList.remove('msg-animation');
    email.style.borderColor = '';
    registerButton.disabled = false;
}

/**
 * Function that sources the user back to the Log-in-Section and
 * shows an animated pop-out which says that the registration is successful
 */
function sourceToLogin() {
    backToLogin();
    success.classList.add('msg-animation');
}