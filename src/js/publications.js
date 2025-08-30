import { api } from "../utils/api";

// Renderiza las publicaciones dentro de <section class="cards">
export async function loadPublications() {
  const cardsContainer = document.querySelector(".cards");

  try {
    const publications = await api.getPublications();

    if (!Array.isArray(publications) || publications.length === 0) {
      cardsContainer.innerHTML = "<p>No hay publicaciones disponibles.</p>";
      return;
    }

    // Generar las tarjetas con la misma estructura del HTML
    cardsContainer.innerHTML = publications.map(pub => `
      <div class="card">
        <div class="card-logo">
          <img src="${pub.imageUrl || './img/default.jpg'}" alt="Logo Guardería">
          <span class="logo-text">${pub.ownerName || "Desconocido"}</span>
        </div>
        <h3>${pub.title || "Sin título"}</h3>
        <p>${pub.description || "Sin descripción"}</p>
        <button class="btn-card">Ver más</button>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
    cardsContainer.innerHTML = "<p>Error cargando publicaciones.</p>";
  }
}
