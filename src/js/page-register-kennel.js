import { api } from "../utils/api.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.querySelector('.submit-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const emailBtn = document.querySelector('.email-btn');
    const contactBtn = document.querySelector('.contact-btn');
    const scrollBtn = document.getElementById('scrollTopBtn');

    // Form validation
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            } else {
                field.classList.remove('invalid');
            }
        });

        // Validate checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
        const checkedBoxes = form.querySelectorAll('input[type="checkbox"][required]:checked');
        
        if (checkboxes.length > 0 && checkedBoxes.length === 0) {
            isValid = false;
            checkboxes[0].focus();
            showMessage('Por favor, acepta todos los requerimientos obligatorios.', 'error');
        }

        // Validate file input (minimum 3 photos)
        const fileInput = document.getElementById('facilitiesPhoto');
        if (fileInput.files.length < 3) {
            isValid = false;
            fileInput.classList.add('invalid');
            showMessage('Debes subir al menos 3 fotos de las instalaciones.', 'error');
        } else {
            fileInput.classList.remove('invalid');
        }

        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return isValid;
    }

    // Show message function
    function showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
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

    // Collect form data
    function collectFormData() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        return data;
    }

    // Submit form handler
    async function handleSubmit(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = collectFormData();
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registrando...';
            
            try {
                // Try to register kennel via API
                const response = await api.registerKennel(formData);
                
                showMessage('¡Registro enviado exitosamente! Nos pondremos en contacto contigo pronto.', 'success');
                
                // Reset form
                form.reset();
                
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Error al enviar el registro. Intenta nuevamente.', 'error');
            } finally {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Registrar';
            }
        }
    }

    // Cancel form handler
    function handleCancel() {
        if (confirm('¿Estás seguro de que deseas cancelar? Se perderán todos los datos ingresados.')) {
            form.reset();
            showMessage('Formulario cancelado.', 'info');
        }
    }

    // Email handler
    function handleEmail() {
        if (validateForm()) {
            const formData = collectFormData();
            const emailContent = generateEmailContent(formData);
            
            // Create mailto link
            const subject = encodeURIComponent('Solicitud de Registro - Guardería PawCare');
            const body = encodeURIComponent(emailContent);
            const mailtoLink = `mailto:info@pawcare.com?subject=${subject}&body=${body}`;
            
            window.location.href = mailtoLink;
            showMessage('Se ha abierto tu cliente de correo con la información del formulario.', 'info');
        }
    }

    // Generate email content
    function generateEmailContent(data) {
        let content = 'Solicitud de Registro para Guardería PawCare\n\n';
        
        content += 'INFORMACIÓN PERSONAL DEL RESPONSABLE:\n';
        content += `Nombre completo: ${data.fullName || ''}\n`;
        content += `Documento de identidad: ${data.idDocument || ''}\n`;
        content += `Teléfono: ${data.contactNumber || ''}\n`;
        content += `Dirección: ${data.address || ''}\n`;
        content += `Correo electrónico: ${data.email || ''}\n\n`;
        
        content += 'INFORMACIÓN DE LA GUARDERÍA:\n';
        content += `Nombre de la guardería: ${data.nurseryName || ''}\n`;
        content += `Dirección de la guardería: ${data.nurseryAddress || ''}\n`;
        content += `Capacidad máxima: ${data.maxCapacity || ''}\n`;
        content += `Tipos de servicios: ${data.serviceTypes || ''}\n\n`;
        
        content += 'EXPERIENCIA Y REFERENCIAS:\n';
        content += `Experiencia previa: ${data.experience || 'No especificada'}\n`;
        content += `Referencias: ${data.references || 'No especificadas'}\n\n`;
        
        content += 'Requerimientos legales y de seguridad: Aceptados\n';
        content += '\nGracias por tu interés en formar parte de PawCare.';
        
        return content;
    }

    // Contact button handler
    function handleContact() {
        showMessage('Contacto: info@pawcare.com | Teléfono: +57 300 123 4567', 'info');
    }

    // Real-time validation
    function addRealTimeValidation() {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('invalid');
                } else {
                    this.classList.remove('invalid');
                }
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid') && this.value.trim()) {
                    this.classList.remove('invalid');
                }
            });
        });

        // Special validation for email
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.classList.add('invalid');
                showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            }
        });

        // File input validation
        const fileInput = document.getElementById('facilitiesPhoto');
        fileInput.addEventListener('change', function() {
            if (this.files.length < 3) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    }

    // Add CSS for invalid fields
    function addValidationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .form-group input.invalid,
            .form-group textarea.invalid {
                border-color: #dc3545;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
            }
            
            .form-group input.invalid:focus,
            .form-group textarea.invalid:focus {
                border-color: #dc3545;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
            }
        `;
        document.head.appendChild(style);
    }

    // Scroll to top functionality
    function initScrollToTop() {
        // Show the button only when scrolled more than 200px
        window.addEventListener("scroll", () => {
            if (window.scrollY > 200) {
                scrollBtn.classList.add("show");
            } else {
                scrollBtn.classList.remove("show");
            }
        });

        // Smooth scroll to top when clicked
        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Event listeners
    form.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    emailBtn.addEventListener('click', handleEmail);
    contactBtn.addEventListener('click', handleContact);

    // Initialize
    addRealTimeValidation();
    addValidationStyles();
    initScrollToTop();

    console.log('PawCare Kennel Registration Form initialized successfully!');
});


