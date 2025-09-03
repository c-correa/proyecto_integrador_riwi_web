import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#stores-container");
  if (!container) return;

  try {
    // 1. Check if the user is in localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      // 2. Look for the store associated with the owner
      const stores = await api.getStores();
      const myStore = stores.find(store => String(store.owner_id) === String(user.id));

      if (myStore && myStore.is_active === false) {
        // 3. Redirect if the store exists but is inactive
        window.location.href = "../pages/form-info-store.html";
        return;
      }
    }

    // If there is no user or validation does not apply → list stores
    const stores = await api.getStores();

    if (!stores.length) {
      container.innerHTML = `<p>No stores have been registered yet</p>`;
      return;
    }

    // Build the cards dynamically
    container.innerHTML = stores.map(store => `
      <div class="store-card">
        <h3>${store.name}</h3>
        <p>${store.description || "No description available"}</p>
        <p><strong>Address:</strong> ${store.address || "Not specified"}</p>
        <a href="../src/pages/storeDetail.html?id=${store.id}" class="btn-detalle">See more</a>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error loading stores:", err);
    container.innerHTML = `<p class="error">Could not load the stores. Please try again later.</p>`;
  }
});
