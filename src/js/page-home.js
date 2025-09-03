import { api } from "../utils/api";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#stores-container");
  const navRight = document.querySelector(".nav-right");

  if (!container) return;

  try {
    const userId = localStorage.getItem("owner_id"); // now only store the ID
    let user = null;

    if (userId) {
      // fetch the user by ID from the API
      user = await api.getOwner(userId);
      console.log("User loaded:", user);

      if (user) {
        const stores = await api.getStores();
        const myStore = stores.find(store => String(store.owner_id) === String(user.id));

        if (myStore) {
          if (!myStore.is_active) {
            // store exists but inactive → redirect
            window.location.href = "../pages/form-info-store.html";
            return;
          } else {
            // store active → redirect
            window.location.href = "../pages/admin.html";
            return;
          }
        }
      }
    }

    // --- if there is no user or validation does not apply → list stores
    const stores = await api.getStores();

    if (!stores.length) {
      container.innerHTML = `<p>No stores have been registered yet</p>`;
      return;
    }

    container.innerHTML = stores.map(store => `
      <div class="store-card">
        <h3>${store.name}</h3>
        <p>${store.description || "No description available"}</p>
        <p><strong>Address:</strong> ${store.address || "Not specified"}</p>
        <a href="../pages/store-detail.html?id=${store.id}" class="btn-detalle">See more</a>
      </div>
    `).join("");

    // if the user has an active store → add button to header
    if (user && stores.some(s => String(s.owner_id) === String(user.id) && s.is_active)) {
      const adminLink = document.createElement("a");
      adminLink.href = "../pages/admin.html";
      adminLink.className = "nav-link";
      adminLink.textContent = "Admin View";
      navRight.appendChild(adminLink);
    }

    container.classList.add("stores-grid");

    container.innerHTML = stores.map(s => `
      <div class="store-card">
        <img 
          src="${s.logo || '../assets/default-store.png'}" 
          alt="${s.name}" 
          class="store-logo"
        />
        <h2 class="store-title">${s.name}</h2>
        <p class="store-description">${s.description || "No description available"}</p>
        <button 
          class="store-btn"
          onclick="window.location.href='../src/pages/store-detail.html?id=${s.id}'"
        >
          View store
        </button>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error loading stores:", err);
    container.innerHTML = `<p class="error">Could not load the stores. Please try again later.</p>`;
  }
});
