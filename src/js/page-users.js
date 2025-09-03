import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("users-list");

  try {
    const owners = await api.getOwners();
    container.innerHTML = owners.map(o => `
      <div class="p-3 border rounded">
        <strong>${o.name}</strong><br>
        <span class="text-sm">${o.email}</span>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = `<p class="text-red-600">Error loading owner</p>`;
  }
});
