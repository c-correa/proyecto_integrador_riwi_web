import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const kennelsContainer = document.getElementById("guarderias-container");

  // Cargar y renderizar guarderías al cargar la página
  async function loadKennels() {
    try {
      const kennels = await api.getStores();
      renderKennels(kennels);
    } catch (error) {
      kennelsContainer.innerHTML = `<p class="error">Error al cargar las guarderías.</p>`;
    }
  }

  // Renderizar tarjetas de guarderías
  function renderKennels(kennels) {
    kennelsContainer.innerHTML = "";
    if (!kennels.length) {
      kennelsContainer.innerHTML = `<p>No se encontraron guarderías.</p>`;
      return;
    }
    kennels.forEach(kennel => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img src="img/logo.png" alt="Kennel logo" class="card-img">
        <div class="card-body">
          <h2>${kennel.name || "Sin nombre"}</h2>
          <p>${kennel.address || kennel.description || "Sin descripción"}</p>
          <div class="actions">
            <button class="btn approve">Aprobar</button>
            <button class="btn danger">Rechazar</button>
          </div>
        </div>
      `;
      // Botón Aprobar
      card.querySelector(".btn.approve").addEventListener("click", () => handleApprove(kennel.id));
      // Botón Rechazar
      card.querySelector(".btn.danger").addEventListener("click", () => handleReject(kennel.id));
      kennelsContainer.appendChild(card);
    });
  }

  // Aprobar guardería
  async function handleApprove(id) {
    try {
      await api.getStore(id); // Opcional: puedes validar si existe
      await fetch(`http://localhost:3000/stores/${id}/approve`, { method: "PATCH" });
      alert("Guardería aprobada exitosamente.");
      loadKennels();
    } catch (error) {
      alert("Error al aprobar la guardería.");
    }
  }

  // Rechazar guardería
  async function handleReject(id) {
    try {
      await api.getStore(id); // Opcional: puedes validar si existe
      await fetch(`http://localhost:3000/stores/${id}/reject`, { method: "PATCH" });
      alert("Guardería rechazada exitosamente.");
      loadKennels();
    } catch (error) {
      alert("Error al rechazar la guardería.");
    }
  }

  loadKennels();
});
