/**
 * Clears error messages and resets styling when user types
 */
function clearError() {
    const email = document.getElementById('email');
    const fault = document.getElementById('fault');
    const success = document.getElementById('success');
    
    if (email) email.style.borderColor = '';
    if (fault) fault.classList.remove('msg-animation');
    if (success) success.classList.remove('msg-animation');
}

/**
 * Sends password reset email via backend API
 */
async function sendPasswordResetEmail() {
    const email = document.getElementById('email');
    const fault = document.getElementById('fault');
    const success = document.getElementById('success');
    const resetButton = document.getElementById('resetButton');
    
    if (!email.value) {
        return;
    }
    
    // Disable button during request
    resetButton.disabled = true;
    resetButton.textContent = 'Sending...';
    
    try {
        const response = await fetch(STORAGE_URL + 'auth/password-reset/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success - show success message
            email.style.borderColor = 'green';
            if (fault) fault.classList.remove('msg-animation');
            if (success) {
                success.classList.remove('msg-animation');
                void success.offsetWidth;
                success.classList.add('msg-animation');
            }
            // Redirect to login after 3 seconds
            setTimeout(() => {
                backToLogin();
            }, 3000);
        } else {
            // Error - email doesn't exist
            email.style.borderColor = 'red';
            if (success) success.classList.remove('msg-animation');
            if (fault) {
                fault.classList.remove('msg-animation');
                void fault.offsetWidth; // force reflow to re-trigger animation
                fault.classList.add('msg-animation');
            }
        }
    } catch (error) {
        console.error('Error sending password reset email:', error);
        email.style.borderColor = 'red';
        if (fault) {
            fault.classList.remove('msg-animation');
            void fault.offsetWidth;
            fault.classList.add('msg-animation');
        }
    } finally {
        // Re-enable button
        resetButton.disabled = false;
        resetButton.textContent = 'Send me the email';
    }
}