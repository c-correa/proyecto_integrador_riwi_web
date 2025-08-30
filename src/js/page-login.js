import { api } from "../utils/api.js";
import { showMessage } from "../utils/showMessages.js";

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const credentials = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    
    try {
        console.log("Intentando hacer login con:", credentials);
        
        // Loading state
        const submitBtn = loginForm.querySelector(".login-button");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Iniciando sesión...";
        submitBtn.disabled = true;
        
        // Petición real al API
        const response = await api.login(credentials);
        console.log("Respuesta del login:", response);
        
        // Guardar tokens en localStorage
        if (response.access_token) {
            localStorage.setItem("access_token", response.access_token);
        }
        if (response.refresh_token) {
            localStorage.setItem("refresh_token", response.refresh_token);
        }

        // (Opcional: guardar owner_id si lo usas en la app)
        if (response.owner_id) {
            localStorage.setItem("owner_id", response.owner_id);
        }

        // Mostrar éxito
        showMessage("¡Inicio de sesión exitoso!", "success");

        // Redirigir al profile
        setTimeout(() => {
            console.log("Redirigiendo a profile.html");
            window.location.href = "./index.html";
        }, 1500);

    } catch (error) {
        console.error("Login error:", error);
        showMessage("Error al iniciar sesión. Verifica tus credenciales.", "error");
    } finally {
        // Resetear botón
        const submitBtn = loginForm.querySelector(".login-button");
        submitBtn.textContent = "Iniciar sesión";
        submitBtn.disabled = false;
    }
});
