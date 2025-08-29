import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const logoutBtn = document.getElementById("logoutBtn");
    const petsGrid = document.getElementById("petsGrid");
    const reservationsList = document.getElementById("reservationsList");
    const favoritesGrid = document.getElementById("favoritesGrid");

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!token || !user.id) {
        // Redirect to login if not authenticated
        window.location.href = "login.html";
        return;
    }

    // Load user data
    loadUserProfile();
    loadUserPets();
    loadUserReservations();
    loadUserFavorites();

    // Logout functionality
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "../../index.html";
    });

    async function loadUserProfile() {
        try {
            // Update profile info
            userName.textContent = user.name || "Usuario";
            userEmail.textContent = user.email || "usuario@email.com";
        } catch (error) {
            console.error("Error loading user profile:", error);
        }
    }

    async function loadUserPets() {
        try {
            // Mock data for pets - in real app, this would come from API
            const mockPets = [
                {
                    id: 1,
                    name: "Max",
                    breed: "Golden Retriever",
                    age: 3,
                    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23ff8c42'/%3E%3Cpath d='M35 45c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45zm22 0c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45z' fill='%23ffffff'/%3E%3C/svg%3E"
                },
                {
                    id: 2,
                    name: "Luna",
                    breed: "Border Collie",
                    age: 2,
                    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23ff8c42'/%3E%3Cpath d='M35 45c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45zm22 0c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45z' fill='%23ffffff'/%3E%3C/svg%3E"
                }
            ];

            displayPets(mockPets);
        } catch (error) {
            console.error("Error loading pets:", error);
        }
    }

    function displayPets(pets) {
        const petsHTML = pets.map(pet => `
            <div class="pet-card">
                <img src="${pet.image}" alt="${pet.name}">
                <h3>${pet.name}</h3>
                <p>${pet.breed} - ${pet.age} años</p>
                <button class="btn-edit" onclick="editPet(${pet.id})">Editar</button>
            </div>
        `).join("");

        petsGrid.innerHTML = petsHTML + `
            <button class="btn-add-pet" onclick="addPet()">+ Agregar Mascota</button>
        `;
    }

    async function loadUserReservations() {
        try {
            // Mock data for reservations - in real app, this would come from API
            const mockReservations = [
                {
                    id: 1,
                    serviceName: "Prados Caninos",
                    serviceType: "Guardería de día",
                    date: "15 de Enero, 2025",
                    status: "confirmed"
                },
                {
                    id: 2,
                    serviceName: "Huellas Felices",
                    serviceType: "Paseo",
                    date: "12 de Enero, 2025",
                    status: "completed"
                },
                {
                    id: 3,
                    serviceName: "Pet Paradise",
                    serviceType: "Hospedaje nocturno",
                    date: "20 de Enero, 2025",
                    status: "pending"
                }
            ];

            displayReservations(mockReservations);
        } catch (error) {
            console.error("Error loading reservations:", error);
        }
    }

    function displayReservations(reservations) {
        const reservationsHTML = reservations.map(reservation => `
            <div class="reservation-card">
                <div class="reservation-info">
                    <h3>${reservation.serviceName}</h3>
                    <p>${reservation.serviceType} - ${reservation.date}</p>
                    <span class="status ${reservation.status}">${getStatusText(reservation.status)}</span>
                </div>
                <button class="btn-view" onclick="viewReservation(${reservation.id})">Ver Detalles</button>
            </div>
        `).join("");

        reservationsList.innerHTML = reservationsHTML;
    }

    function getStatusText(status) {
        const statusMap = {
            'confirmed': 'Confirmada',
            'completed': 'Completada',
            'pending': 'Pendiente',
            'cancelled': 'Cancelada'
        };
        return statusMap[status] || status;
    }

    async function loadUserFavorites() {
        try {
            // Mock data for favorites - in real app, this would come from API
            const mockFavorites = [
                {
                    id: 1,
                    name: "Prados Caninos",
                    type: "Guardería de día",
                    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23e6f7ff'/%3E%3Cpath d='M35 45c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45zm22 0c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45z' fill='%23ff8c42'/%3E%3C/svg%3E"
                },
                {
                    id: 2,
                    name: "Huellas Felices",
                    type: "Paseo y cuidado",
                    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23e6f7ff'/%3E%3Cpath d='M35 45c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45zm22 0c0-5 4-9 9-9s9 4 9 9v10c0 5-4 9-9 9s-9-4-9-9V45z' fill='%23ff8c42'/%3E%3C/svg%3E"
                }
            ];

            displayFavorites(mockFavorites);
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    }

    function displayFavorites(favorites) {
        const favoritesHTML = favorites.map(favorite => `
            <div class="favorite-card">
                <img src="${favorite.image}" alt="${favorite.name}">
                <h3>${favorite.name}</h3>
                <p>${favorite.type}</p>
                <button class="btn-remove" onclick="removeFavorite(${favorite.id})">Quitar</button>
            </div>
        `).join("");

        favoritesGrid.innerHTML = favoritesHTML;
    }

    // Global functions for button actions
    window.editPet = function(petId) {
        alert(`Editar mascota con ID: ${petId}`);
        // In real app, this would open an edit modal or navigate to edit page
    };

    window.addPet = function() {
        alert("Agregar nueva mascota");
        // In real app, this would open an add pet modal or navigate to add pet page
    };

    window.viewReservation = function(reservationId) {
        alert(`Ver detalles de reserva con ID: ${reservationId}`);
        // In real app, this would show reservation details
    };

    window.removeFavorite = function(favoriteId) {
        if (confirm("¿Estás seguro de que quieres quitar este favorito?")) {
            alert(`Favorito ${favoriteId} removido`);
            // In real app, this would remove from API and update UI
        }
    };
});

