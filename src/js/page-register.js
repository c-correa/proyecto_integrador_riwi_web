import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const registerButton = document.getElementById("register-button");
    
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        const userData = {
            full_name: formData.get("user"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password")
        };
        
        try {
            // const submitBtn = registerForm.querySelector(".register-button");
            const originalText = registerButton.textContent;
            registerButton.textContent = "Registering...";
            registerButton.disabled = true;

            // Debug: data being sent
            console.log("Data sent:", userData);

            const {data: response} = await api.createOwner(userData);

            // Debug: server response if everything goes well
            console.log("Server response:", response);
            
            showMessage("Registration successful! You can now sign in.", "success");

            await api.createStore({owner_id: response.id})


            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } catch (error) {
            console.error("Registration error:", error);

            // Only the data sent is shown (response does not exist here if there's an error)
            showMessage("Registration failed. Please try again.", "error");
        } finally {
            registerButton.textContent = "Register";
            registerButton.disabled = false;
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

    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.classList.add('invalid');
            showMessage('Please enter a valid email address.', 'error');
        }
    });

    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', function() {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (this.value && !phoneRegex.test(this.value)) {
            this.classList.add('invalid');
            showMessage('Please enter a valid phone number.', 'error');
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
    messageDiv.className = `auth-message ${type}`;
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
        border: `1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'}`
    });

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
