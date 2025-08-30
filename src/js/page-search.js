import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const searchBtn = document.getElementById("searchBtn");
    const backToStartBtn = document.querySelector(".back-to-start");

    // Cargar servicios iniciales desde la API
    await loadServices();

    // Botón búsqueda
    searchBtn.addEventListener("click", async () => {
        await performSearch();
    });

    // Botón volver al inicio
    if (backToStartBtn) {
        window.addEventListener("scroll", () => {
            backToStartBtn.style.display = window.scrollY > 200 ? "block" : "none";
        });

        backToStartBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Remover tags de filtros
    document.querySelectorAll(".remove-tag").forEach(button => {
        button.addEventListener("click", e => {
            e.target.parentElement.remove();
        });
    });

    // Actualizar rango de precio
    const minPriceSlider = document.getElementById("minPrice");
    const maxPriceSlider = document.getElementById("maxPrice");
    const priceRangeDisplay = document.querySelector(".price-range");

    if (minPriceSlider && maxPriceSlider && priceRangeDisplay) {
        function updatePriceRange() {
            priceRangeDisplay.textContent = `$${minPriceSlider.value} - $${maxPriceSlider.value}`;
        }
        minPriceSlider.addEventListener("input", updatePriceRange);
        maxPriceSlider.addEventListener("input", updatePriceRange);
        updatePriceRange();
    }
});

async function loadServices() {
    const servicesContent = document.getElementById("servicesContent");
    try {
        const services = await api.getStores();
        displayServices(services);
    } catch (error) {
        console.error("Error loading services:", error);
        servicesContent.innerHTML = '<div class="loading">No se pudieron cargar los servicios.</div>';
    }
}

async function performSearch() {
    const servicesContent = document.getElementById("servicesContent");

    const filters = {
        country: document.getElementById("country")?.value || undefined,
        capacity: document.getElementById("capacity")?.value || undefined,
        animalType: document.getElementById("animalType")?.value || undefined,
        priceRange: {
            min: Number(document.getElementById("minPrice")?.value) || 0,
            max: Number(document.getElementById("maxPrice")?.value) || 100,
        },
        services: getSelectedServices()
    };

    try {
        servicesContent.innerHTML = '<div class="loading">Buscando servicios...</div>';
        const results = await api.searchServices(filters);
        displayServices(results);
    } catch (error) {
        console.error("Error searching services:", error);
        servicesContent.innerHTML = '<div class="loading">No se encontraron servicios.</div>';
    }
}

function getSelectedServices() {
    const selectedServices = [];
    document.querySelectorAll('.checkbox-item input[type="checkbox"]:checked').forEach(checkbox => {
        const label = checkbox.closest('.checkbox-item').querySelector('.label-title');
        if (label) selectedServices.push(label.textContent.trim());
    });
    return selectedServices;
}

function displayServices(services) {
    const servicesContent = document.getElementById("servicesContent");

    if (!services || services.length === 0) {
        servicesContent.innerHTML = '<div class="loading">No se encontraron servicios</div>';
        return;
    }

    const servicesHTML = services.map(service => `
        <div class="service-card">
            <div class="service-header">
                <img src="${service.logo || 'default-logo.svg'}" alt="${service.name}" class="provider-avatar">
                <div class="service-info">
                    <h2>${service.name || 'Nombre del servicio'}</h2>
                    <p>${service.address || service.description || ''}</p>
                    <button class="favorite-btn">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Contactar
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    servicesContent.innerHTML = servicesHTML;
}
