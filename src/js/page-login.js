import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    
    // Form submission handler
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const credentials = {
            username: formData.get("username"),
            password: formData.get("password")
        };
        
        try {
            // Show loading state
            const submitBtn = loginForm.querySelector(".login-button");
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Iniciando sesión...";
            submitBtn.disabled = true;
            
            // Try to login via API
            const response = await api.login(credentials);
            
            // Store user data (in a real app, you'd use proper session management)
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("token", response.token);
            
            // Show success message
            showMessage("¡Inicio de sesión exitoso!", "success");
            
            // Redirect to profile page
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1500);
            
        } catch (error) {
            console.error("Login error:", error);
            showMessage("Error al iniciar sesión. Verifica tus credenciales.", "error");
        } finally {
            // Reset button state
            const submitBtn = loginForm.querySelector(".login-button");
            submitBtn.textContent = "Iniciar sesión";
            submitBtn.disabled = false;
        }
    });
});

// Toggle password visibility
window.togglePassword = function() {
    const passwordInput = document.getElementById('password');
    const eyeShow = document.getElementById('eye-show');
    const eyeHide = document.getElementById('eye-hide');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeShow.classList.add('hidden');
        eyeHide.classList.remove('hidden');
    } else {
        passwordInput.type = 'password';
        eyeShow.classList.remove('hidden');
        eyeHide.classList.add('hidden');
    }
};

// Show message function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles for message
    Object.assign(messageDiv.style, {
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center',
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '1000',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        backgroundColor: type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1',
        color: type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460',
        border: `1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'}`
    });

    document.body.appendChild(messageDiv);

    // Auto remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

