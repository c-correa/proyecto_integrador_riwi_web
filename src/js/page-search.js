import { api } from "../utils/api.js";
import { showMessage } from "../utils/showMessages.js";

document.addEventListener("DOMContentLoaded", async () => {
    const searchBtn = document.getElementById("searchBtn");
    const backToStartBtn = document.querySelector(".back-to-start");

    try {
        await Promise.all([loadFilters(), loadServices()]);
    } catch (err) {
        console.error("Error inicial cargando filtros/servicios:", err);
        const servicesContent = document.getElementById("servicesContent");
        if (servicesContent) servicesContent.innerHTML = '<div class="loading">No fue posible conectar con el servidor.</div>';
        showMessage("No se pudo conectar con el servidor. Comprueba que el backend esté iniciado.", "error");
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", async () => {
            await performSearch();
        });
    }

    if (backToStartBtn) {
        window.addEventListener("scroll", () => {
            backToStartBtn.style.display = window.scrollY > 200 ? "block" : "none";
        });
        backToStartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    document.body.addEventListener("click", (e) => {
        if (e.target.matches(".remove-tag")) {
            const tag = e.target.closest(".filter-tag");
            if (tag) tag.remove();
        }
    });

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

    window.navigateToHome = () => {
        window.location.href = "../../index.html";
    };
});

async function loadFilters() {
    const sidebar = document.querySelector(".sidebar .filter-section");
    if (!sidebar) return;

    try {
        const stores = await api.getStores();
        if (!Array.isArray(stores) || stores.length === 0) {
            sidebar.insertAdjacentHTML("beforeend", `<p class="loading">No hay filtros disponibles</p>`);
            return;
        }

        const countries = new Set();
        const capacities = new Set();
        const animalTypes = new Set();

        stores.forEach(s => {
            if (s.country) countries.add(s.country);
            if (s.capacity) capacities.add(String(s.capacity));
            if (s.animalType) {
                if (Array.isArray(s.animalType)) s.animalType.forEach(a => animalTypes.add(a));
                else animalTypes.add(s.animalType);
            }
        });

        const buildCheckboxList = (title, items, name) => {
            if (!items || items.size === 0) return '';
            return `
                <div class="filter-group">
                    <h4>${title}</h4>
                    <div class="checkbox-list" data-group="${name}">
                        ${Array.from(items).map(item => `
                            <label class="checkbox-item">
                                <input type="checkbox" data-filter-group="${name}" value="${item}">
                                <span class="label-title">${item}</span>
                            </label>
                        `).join("")}
                    </div>
                </div>
            `;
        };

        const html = `
            <div id="filterTags" class="filter-tags"></div>
            ${buildCheckboxList('Country', countries, 'country')}
            ${buildCheckboxList('Capacity', capacities, 'capacity')}
            ${buildCheckboxList('Animal Type', animalTypes, 'animalType')}
            <div class="filter-group">
                <h4>Price</h4>
                <div class="price-controls">
                    <input id="minPrice" type="range" min="0" max="1000" value="0">
                    <input id="maxPrice" type="range" min="0" max="1000" value="100">
                    <div class="price-range"></div>
                </div>
            </div>
        `;

        sidebar.insertAdjacentHTML("beforeend", html);

        sidebar.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener("change", (e) => {
                const val = e.target.value;
                const group = e.target.dataset.filterGroup || 'filter';
                if (e.target.checked) addFilterTag(val, group);
                else removeFilterTag(val, group);
            });
        });

    } catch (err) {
        console.error(err);
        showMessage("No se pudieron cargar filtros", "error");
        sidebar.insertAdjacentHTML("beforeend", `<p class="loading">Error cargando filtros</p>`);
    }
}

function addFilterTag(value, group) {
    const container = document.getElementById("filterTags") || (() => {
        const c = document.createElement("div");
        c.id = "filterTags";
        c.className = "filter-tags";
        const sidebar = document.querySelector(".sidebar .filter-section");
        if (sidebar) sidebar.prepend(c);
        return c;
    })();

    const exists = Array.from(container.querySelectorAll(".filter-tag"))
        .some(t => t.dataset.group === group && t.dataset.value === String(value));
    if (exists) return;

    const tag = document.createElement("span");
    tag.className = "filter-tag";
    tag.dataset.group = group;
    tag.dataset.value = value;
    tag.innerHTML = `${value} <button type="button" class="remove-tag" aria-label="remove">&times;</button>`;
    container.appendChild(tag);
}

function removeFilterTag(value, group) {
    const container = document.getElementById("filterTags");
    if (!container) return;
    const tag = Array.from(container.querySelectorAll(".filter-tag"))
        .find(t => t.dataset.group === group && t.dataset.value === String(value));
    if (tag) tag.remove();
}

async function loadServices() {
    const servicesContent = document.getElementById("servicesContent");
    if (!servicesContent) return;
    try {
        servicesContent.innerHTML = '<div class="loading">Cargando servicios...</div>';
        const services = await api.getStores();
        displayServices(services);
    } catch (error) {
        console.error(error);
        servicesContent.innerHTML = '<div class="loading">No se pudieron cargar los servicios.</div>';
        showMessage("Error al cargar servicios", "error");
    }
}

async function performSearch() {
    const servicesContent = document.getElementById("servicesContent");
    if (!servicesContent) return;

    const filterTags = Array.from(document.querySelectorAll("#filterTags .filter-tag"))
        .map(tag => ({ group: tag.dataset.group, value: tag.dataset.value }));

    const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => ({ group: cb.dataset.filterGroup || null, value: cb.value }));

    const minPrice = Number(document.getElementById("minPrice")?.value) || 0;
    const maxPrice = Number(document.getElementById("maxPrice")?.value) || 1000;

    const filters = {
        tags: filterTags,
        checks: selected,
        priceRange: { min: minPrice, max: maxPrice }
    };

    try {
        servicesContent.innerHTML = '<div class="loading">Buscando servicios...</div>';

        // Fallback: obtener todos y filtrar en cliente si /search no existe
        const all = await api.getStores();

        const results = (Array.isArray(all) ? all : []).filter(s => {
            // ejemplo simple: filtrar por country/capacity/animalType y precio si existieran
            if (filters.checks.length) {
                for (const c of filters.checks) {
                    if (c.group === 'country' && s.country !== c.value) return false;
                    if (c.group === 'capacity' && String(s.capacity) !== String(c.value)) return false;
                    if (c.group === 'animalType') {
                        const types = Array.isArray(s.animalType) ? s.animalType : [s.animalType];
                        if (!types.includes(c.value)) return false;
                    }
                }
            }
            // tags (opcional) - si tus tags mappean a propiedades, adaptarlo
            // precio (si la propiedad price existe)
            if (s.price != null) {
                if (s.price < filters.priceRange.min || s.price > filters.priceRange.max) return false;
            }
            return true;
        });

        if (!results || results.length === 0) {
            servicesContent.innerHTML = '<div class="loading">No se encontraron servicios.</div>';
            showMessage("No se encontraron servicios con esos filtros", "info");
            return;
        }
        displayServices(results);
    } catch (error) {
        console.error(error);
        servicesContent.innerHTML = '<div class="loading">Error al buscar servicios.</div>';
        showMessage("Error al realizar la búsqueda", "error");
    }
}

function displayServices(services) {
    const servicesContent = document.getElementById("servicesContent");
    if (!servicesContent) return;

    if (!services || services.length === 0) {
        servicesContent.innerHTML = '<div class="loading">No se encontraron servicios</div>';
        return;
    }

    const servicesHTML = services.map(service => `
        <div class="service-card" data-id="${service.id || ''}">
            <div class="service-header">
                <img src="${service.logo || '../public/img/default-logo.svg'}" alt="${service.name || 'Proveedor'}" class="provider-avatar">
                <div class="service-info">
                    <h2>${service.name || 'Nombre del servicio'}</h2>
                    <p>${service.address || service.description || ''}</p>
                    <div class="service-meta">
                        ${service.country ? `<span class="meta-item">${service.country}</span>` : ''}
                        ${service.capacity ? `<span class="meta-item">Capacidad: ${service.capacity}</span>` : ''}
                        ${service.animalType ? `<span class="meta-item">${Array.isArray(service.animalType) ? service.animalType.join(', ') : service.animalType}</span>` : ''}
                    </div>
                    <div class="service-actions">
                        <button class="contact-btn" data-id="${service.id || ''}">Contactar</button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    servicesContent.innerHTML = servicesHTML;

    servicesContent.querySelectorAll(".contact-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.id;
            showMessage(`Iniciar contacto con servicio ${id}`, "success");
        });
    });
}
