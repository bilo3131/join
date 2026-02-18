/**
 * Sources back to the Log-in-page
 */
function backToLogin() {
    window.location.href = 'login.html';
}

/**
 * Compares the written passwords
 * if they are the same, the password-change will be accept
 */
function comparePassword() {
    if (newPassword.value == confirmPassword.value) {
        resetButton.disabled = false;
    } else {
        resetButton.disabled = true;
    }
}

/**
 * Changes the password via backend API
 */
async function changePassword() {
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const resetButton = document.getElementById('resetButton');
    const fault = document.getElementById('fault');
    
    // Check if passwords match
    if (newPassword.value !== confirmPassword.value) {
        fault.textContent = 'Passwords do not match';
        fault.classList.add('msg-animation');
        return;
    }
    
    // Get uid and token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const token = urlParams.get('token');
    
    if (!uid || !token) {
        fault.textContent = 'Invalid reset link';
        fault.classList.add('msg-animation');
        return;
    }
    
    // Disable button during request
    resetButton.disabled = true;
    resetButton.textContent = 'Resetting...';
    
    try {
        const response = await fetch(STORAGE_URL + 'auth/password-reset/confirm/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: uid,
                token: token,
                password: newPassword.value
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success - redirect to login
            fault.classList.remove('msg-animation');
            alert('Password reset successfully! You can now log in with your new password.');
            window.location.href = 'login.html';
        } else {
            // Error
            fault.textContent = data.error || 'Failed to reset password. Please try again.';
            fault.classList.add('msg-animation');
            resetButton.disabled = false;
            resetButton.textContent = 'Continue';
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        fault.textContent = 'An error occurred. Please try again.';
        fault.classList.add('msg-animation');
        resetButton.disabled = false;
        resetButton.textContent = 'Continue';
    }
}