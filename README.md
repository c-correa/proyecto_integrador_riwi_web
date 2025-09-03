# PawCare - Pet Care Services Platform

Description
This project corresponds to the **web frontend** of the RIWI Integrator Project.  
It is developed with **Vite** as a bundler and **TailwindCSS** for style management.  

The architecture combines concepts from **SPA (Single Page Application)** and **MPA (Multi Page Application)**, allowing for hybrid development:  
- **SPA** for dynamic interaction with the backend.  
- **MPA** for static pages and fast navigation between views.  

---

## Technologies used
- **Vite** → Fast and lightweight development tool for frontend projects.  
- **TailwindCSS** → Utility-based CSS framework.  
- **JavaScript (ESM)** → Interaction logic and API consumption.  
- **PostCSS** → Style processor.

---

## Project structure

├── public/ # Directly accessible static files
│ └── img/ # Images and graphic resources
│
├── src/
│ ├── js/ # Logic for each page
│ │ ├── formInfoStore.js # Store information form handling
│ │ ├── main.js # Global initialization
│ │ ├── page-admin.js # Logic for the administration view
│ │ ├── page-home.js # Logic for the home page
│ │ ├── page-login.js # Login handling
│ │ ├── page-register.js # User registration handling
│ │ ├── page-search.js # Search handling
│ │ ├── page-store-detail.js# Details of a store/branch
│ │ └── page-users.js # User management
│ │
│ ├── pages/ # HTML views
│ │ ├── admin.html
│ │ ├── formInfoStore.html
│ │ ├── login.html
│ │ ├── register.html
│ │ ├── search.html
│ │ └── storeDetail.html
│ │
│ └── utils/ # Reusable support functions
│ ├── api.js # Connection to the Backend API
│ ├── renderStoresBranch.js # Dynamic rendering of branches
│ └── showMessages.js # Utility for displaying messages to the user
│
├── index.html # Home page
├── vite.config.js # Vite configuration
├── postcss.config.js # PostCSS configuration
├── package.json # Dependencies and scripts
└── package-lock.json



---

## Installation and execution

Clone the repository:

```bash```
git clone https://github.com/c-correa/proyecto_integrador_riwi_web.git
cd proyecto_integrador_riwi_web 


npm install
npm run dev




##  Connection to the API

This frontend requires the Backend API to be running.
Backend repository: c-correa/proyecto_integrador_riwi_api

Make sure you have both projects running:

Backend API (proyecto_integrador_riwi_api).

Web frontend (proyecto_integrador_riwi_web).

This way, the views will be able to consume the endpoints correctly.



## Architecture

Hybrid frontend (SPA + MPA):

As an SPA, it leverages JavaScript to dynamically consume data from the API (search, store details, branches).

As an MPA, it uses several HTML pages to handle independent views (login, register, admin).

Styles with TailwindCSS:
Allows for fast, consistent, and highly configurable design.

### API consumption:
Centralized in src/utils/api.js, ensuring a single point for managing HTTP requests.

## Conclusion

This project implements a modular and flexible frontend, with a hybrid architecture that combines SPA and MPA.
Thanks to Vite, Tailwind, and integration with the backend, it provides a solid foundation for scaling the application with new features and views.
