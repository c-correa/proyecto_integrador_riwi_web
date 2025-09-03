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
        console.log("Trying to log in with:", credentials);
        
        // Loading state
        const submitBtn = loginForm.querySelector(".login-button");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Signing in...";
        submitBtn.disabled = true;
        
        // Real API request
        const response = await api.login(credentials);
        console.log("Login response:", response);
        
        // Save tokens in localStorage
        if (response.access_token) {
            localStorage.setItem("access_token", response.access_token);
        }
        if (response.refresh_token) {
            localStorage.setItem("refresh_token", response.refresh_token);
        }

        // (Optional: save owner_id if you use it in the app)
        if (response.owner_id) {
            localStorage.setItem("owner_id", response.owner_id);
        }

        // Show success
        showMessage("Login successful!", "success");

        // Redirect to profile
        setTimeout(() => {
            window.location.href = "./profile.html";
        }, 1500);

    } catch (error) {
        console.error("Login error:", error);
        showMessage("Login failed. Please check your credentials.", "error");
    } finally {
        // Reset button
        const submitBtn = loginForm.querySelector(".login-button");
        submitBtn.textContent = "Sign in";
        submitBtn.disabled = false;
    }
});
