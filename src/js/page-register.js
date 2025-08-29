import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        const userData = {
            name: formData.get("usuario"),  // <- aquí está el cambio
            email: formData.get("correo"),
            phone: formData.get("telefono"),
            password: formData.get("password")
        };
        
        try {
            const submitBtn = registerForm.querySelector(".register-button");
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Registrando...";
            submitBtn.disabled = true;
            
            const response = await api.createOwner(userData);
            
            showMessage("¡Registro exitoso! Ya puedes iniciar sesión.", "success");
            
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
            
        } catch (error) {
            console.error("Registration error:", error);
            showMessage("Error al registrarse. Intenta nuevamente.", "error");
        } finally {
            const submitBtn = registerForm.querySelector(".register-button");
            submitBtn.textContent = "Registrarse";
            submitBtn.disabled = false;
        }
    });

    addRealTimeValidation();
});

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

    const emailInput = document.getElementById('correo');
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.classList.add('invalid');
            showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
        }
    });

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

function showMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className =`auth-message ${type}`;
    messageDiv.textContent = message;

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
        border:` 1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'}`
    });

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}