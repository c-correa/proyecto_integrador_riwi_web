import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    
    // Form submission handler
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        const userData = {
            name: formData.get("nombres"),
            email: formData.get("correo"),
            phone: formData.get("telefono"),
            password: formData.get("password")
        };
        
        try {
            // Show loading state
            const submitBtn = registerForm.querySelector(".register-button");
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Registrando...";
            submitBtn.disabled = true;
            
            // Try to register via API
            const response = await api.createOwner(userData);
            
            // Show success message
            showMessage("¡Registro exitoso! Ya puedes iniciar sesión.", "success");
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
            
        } catch (error) {
            console.error("Registration error:", error);
            showMessage("Error al registrarse. Intenta nuevamente.", "error");
        } finally {
            // Reset button state
            const submitBtn = registerForm.querySelector(".register-button");
            submitBtn.textContent = "Registrarse";
            submitBtn.disabled = false;
        }
    });

    // Real-time validation
    addRealTimeValidation();
});

// Toggle password visibility for register
window.togglePasswordRegister = function() {
    const passwordInput = document.getElementById('password-register');
    const eyeShow = document.getElementById('eye-show-register');
    const eyeHide = document.getElementById('eye-hide-register');
    
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

// Real-time validation
function addRealTimeValidation() {
    const form = document.getElementById("registerForm");
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });

    // Special validation for email
    const emailInput = document.getElementById('correo');
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.classList.add('invalid');
            showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
        }
    });

    // Special validation for phone
    const phoneInput = document.getElementById('telefono');
    phoneInput.addEventListener('blur', function() {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (this.value && !phoneRegex.test(this.value)) {
            this.classList.add('invalid');
            showMessage('Por favor, ingresa un número de teléfono válido.', 'error');
        }
    });
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('invalid');
    } else {
        field.classList.remove('invalid');
    }
}

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

// Add CSS for invalid fields
function addValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.invalid {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
        
        .form-group input.invalid:focus {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
        }
    `;
    document.head.appendChild(style);
}

// Initialize validation styles
addValidationStyles();

