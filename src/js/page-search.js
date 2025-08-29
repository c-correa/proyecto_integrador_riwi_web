import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const servicesContent = document.getElementById("servicesContent");
    const searchBtn = document.getElementById("searchBtn");
    const backToStartBtn = document.querySelector(".back-to-start");

    // Load initial services
    await loadServices();

    // Search button functionality
    searchBtn.addEventListener("click", async () => {
        await performSearch();
    });

    // Back to start button functionality
    if (backToStartBtn) {
        // Show/hide button based on scroll
        window.addEventListener("scroll", () => {
            if (window.scrollY > 200) {
                backToStartBtn.style.display = "block";
            } else {
                backToStartBtn.style.display = "none";
            }
        });

        // Smooth scroll to top
        backToStartBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Filter tag removal functionality
    const removeTagButtons = document.querySelectorAll(".remove-tag");
    removeTagButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.target.parentElement.remove();
        });
    });

    // Price range slider functionality
    const minPriceSlider = document.getElementById("minPrice");
    const maxPriceSlider = document.getElementById("maxPrice");
    const priceRangeDisplay = document.querySelector(".price-range");

    if (minPriceSlider && maxPriceSlider && priceRangeDisplay) {
        function updatePriceRange() {
            const minPrice = minPriceSlider.value;
            const maxPrice = maxPriceSlider.value;
            priceRangeDisplay.textContent = `$${minPrice}-${maxPrice}`;
        }

        minPriceSlider.addEventListener("input", updatePriceRange);
        maxPriceSlider.addEventListener("input", updatePriceRange);
    }
});

async function loadServices() {
    const servicesContent = document.getElementById("servicesContent");
    
    try {
        // Try to get services from API
        const services = await api.getStores();
        displayServices(services);
    } catch (error) {
        console.error("Error loading services:", error);
        // Fallback to mock data if API fails
        displayMockServices();
    }
}

async function performSearch() {
    const servicesContent = document.getElementById("servicesContent");
    
    // Get filter values
    const filters = {
        country: "Colombia", // Default
        capacity: "Any",
        animalType: "Any",
        priceRange: {
            min: document.getElementById("minPrice")?.value || 0,
            max: document.getElementById("maxPrice")?.value || 100
        },
        services: getSelectedServices()
    };

    try {
        servicesContent.innerHTML = '<div class="loading">Searching services...</div>';
        
        // Try API search first
        const results = await api.searchServices(filters);
        displayServices(results);
    } catch (error) {
        console.error("Error searching services:", error);
        // Fallback to mock search
        const mockResults = getMockSearchResults(filters);
        displayServices(mockResults);
    }
}

function getSelectedServices() {
    const selectedServices = [];
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('.checkbox-item').querySelector('.label-title');
        if (label) {
            selectedServices.push(label.textContent);
        }
    });
    
    return selectedServices;
}

function displayServices(services) {
    const servicesContent = document.getElementById("servicesContent");
    
    if (!services || services.length === 0) {
        servicesContent.innerHTML = '<div class="loading">No services found</div>';
        return;
    }

    const servicesHTML = services.map(service => `
        <div class="service-card">
            <div class="service-header">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23e6f7ff'/%3E%3Cpath d='M35 45c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45zm22 0c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45z' fill='%23ff8c42'/%3E%3C/svg%3E" alt="${service.name}" class="provider-avatar">
                <div class="service-info">
                    <h2>${service.name || 'Service Name'}</h2>
                    <p>${service.address || service.description || 'Service description'}</p>
                    <button class="favorite-btn">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Contact
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    servicesContent.innerHTML = servicesHTML;
}

function displayMockServices() {
    const mockServices = [
        {
            id: 1,
            name: "Prados caninos",
            address: "Cra. 46 #120 - 137, Nte. Centro Histórico, Villa Julia, Barranquilla.",
            description: "Professional dog care services"
        },
        {
            id: 2,
            name: "Huellas felices",
            address: "Las Mercedes, Barranquilla, Atlántico",
            description: "Happy paws, happy pets"
        },
        {
            id: 3,
            name: "Pet Paradise",
            address: "Calle 80 #12-50, Bogotá",
            description: "Your pet's paradise away from home"
        }
    ];

    displayServices(mockServices);
}

function getMockSearchResults(filters) {
    // Mock search results based on filters
    const allServices = [
        {
            id: 1,
            name: "Prados caninos",
            address: "Cra. 46 #120 - 137, Nte. Centro Histórico, Villa Julia, Barranquilla.",
            description: "Professional dog care services",
            price: 50
        },
        {
            id: 2,
            name: "Huellas felices",
            address: "Las Mercedes, Barranquilla, Atlántico",
            description: "Happy paws, happy pets",
            price: 75
        },
        {
            id: 3,
            name: "Pet Paradise",
            address: "Calle 80 #12-50, Bogotá",
            description: "Your pet's paradise away from home",
            price: 60
        },
        {
            id: 4,
            name: "Canine Care Center",
            address: "Av. 7 #65-30, Cali",
            description: "Premium pet care services",
            price: 80
        }
    ];

    // Filter by price range
    return allServices.filter(service => {
        const price = service.price || 0;
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
}


