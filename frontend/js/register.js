async function initRegister() {
    // Registration is now handled server-side via the REST API
}

async function register() {
    registerButton.disabled = true;
    const [lastName, firstName = ''] = username.value.split(',').map(s => s.trim());

    const response = await setItem('auth/registration/', {
        first_name: firstName,
        last_name: lastName,
        email: email.value,
        username: email.value,
        password: password.value,
        repeated_password: confirmPassword.value,
    }, 'POST');

    if (response?.token) {
        sourceToLogin();
    } else {
        fault.classList.add('msg-animation');
        email.style.borderColor = 'red';
        registerButton.disabled = false;
    }
}

function sourceToLogin() {
    backToLogin();
    success.classList.add('msg-animation');
}
