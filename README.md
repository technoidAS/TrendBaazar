# TrendBaazar — Futuristic Full-Stack E-Commerce Platform

TrendBaazar is a futuristic, next-generation full-stack e-commerce system. It features a stunning, lightweight React frontend utilizing glassmorphism styling and micro-animations, coupled with a robust, enterprise-grade ASP.NET Core Web API backend using Entity Framework Core and SQL Server.

---

## 🏗️ System Architecture & Data Flow

TrendBaazar is designed using the **Strategy Pattern** at the data source layer on the frontend, allowing it to seamlessly switch between local mock storage and a real live backend API with a single environment flag change.

```
Local Mode:
  React Frontend ──> localProvider (LocalStorage DB, OTP = 0000)

API Mode:
  React Frontend ──> apiProvider (Axios HTTP Client)
                          │
                  (Attach JWT Bearer)
                          │
                          ▼
            [ASP.NET Core Web API] (http://localhost:5108)
                          │
                 (Entity Framework)
                          │
                          ▼
                [SQL Server Database] (Somee.com Hosting)
```

---

## 🛠️ Technology Stack

### Frontend (`ecommerce-app`)
* **Core Library:** React 18 with Vite build tool
* **Routing:** React Router v6
* **State Management:** Decoupled React Context APIs (`AuthContext`, `ProductContext`, `CartContext`, `ThemeContext`)
* **Styling:** Premium Vanilla CSS featuring glassmorphism, dynamic HSL colors, variable tokens, and micro-animations
* **Icons:** Lucide React
* **Infinite Scroll:** Intersection Observer API

### Backend (`ecommerce-backend`)
* **Framework:** ASP.NET Core 10 (C#)
* **ORM:** Entity Framework Core (Code-First)
* **Database:** SQL Server (hosted on Somee.com)
* **Authentication:** JWT Bearer authentication
* **Security:** Parameterized queries, CORS policies, role-based authorization rules (`[Authorize(Roles = "admin")]`)
* **Documentation:** Swagger UI (OpenAPI v3)

---

## 📂 Project Structure

```
scratch/
├── README.md                      ← Global system documentation (this file)
│
├── ecommerce-app/                 ← React 18 + Vite Frontend Client
│   ├── src/
│   │   ├── components/            ← Common inputs/buttons, layout, and animations
│   │   ├── context/               ← Global states (Auth, Cart, Products, Theme)
│   │   ├── hooks/                 ← Custom hooks (useDebounce, useLocalStorage)
│   │   ├── pages/                 ← Screen layouts (Home, Listing, Details, Profile, Admin)
│   │   ├── services/              ← Data Providers (localProvider, apiProvider, dpSelector)
│   │   ├── styles/                ← Global CSS resets, tokens, and styling variables
│   │   └── utils/                 ← Formatting helpers and constants
│   ├── .env                       ← Frontend environment configurations
│   └── package.json               ← Frontend project dependencies
│
└── ecommerce-backend/             ← ASP.NET Core Web API Backend
    ├── Controllers/               ← API Controllers (Auth, Product, Profile, Cart, Admin)
    ├── Data/                      ← DB Context (AppDbContext) and DbInitializer seeder
    ├── DTOs/                      ← Data Transfer Objects for strong payload typing
    ├── Models/                    ← Entity Schema Models (User, Product, Order, AddressBook)
    ├── Services/                  ← OtpService (SMS Simulator) and TokenService (JWT Tokenizer)
    ├── Program.cs                 ← App startup configuration & middleware pipeline
    └── appsettings.json           ← DB connection string, CORS, and JWT settings
```

---

## ⚡ Running the Platform Locally

### Prerequisites
* **Node.js** (v18 or higher)
* **.NET SDK** (v10.0 or higher)

---

### Step 1: Start the Backend Web API

1. **Navigate to the backend directory**:
   ```bash
   cd ecommerce-backend
   ```

2. **Seed the database catalog** (Required once to populate SQL Server with 57 products, normalized categories, and default admin configurations):
   ```bash
   dotnet run -- --seed
   ```

3. **Start the API service**:
   ```bash
   dotnet run
   ```
   * The backend service will bootstrap on `http://localhost:5108`.
   * Open the Swagger API Documentation at: `http://localhost:5108/index.html` to explore the endpoints.

---

### Step 2: Start the Frontend Client

1. **Navigate to the frontend directory**:
   ```bash
   cd ../ecommerce-app
   ```

2. **Configure your environment** (`.env`):
   ```env
   VITE_DATA_SOURCE=api
   VITE_API_URL=http://localhost:5108/api
   ```
   *(Set `VITE_DATA_SOURCE=local` to run completely offline without the backend, using localStorage. The default OTP for local mock mode is `0000`)*.

3. **Install dependencies & run the development server**:
   ```bash
   npm install
   npm run dev
   ```
   * Open your browser and navigate to `http://localhost:5173`.

---

## 🔐 Logging in (Authentication Flow)

TrendBaazar uses a secure OTP passwordless phone authorization system.

1. **Requesting access:** Go to `/login` on the frontend, type in your phone number (e.g. `9999999999` for the pre-seeded admin user, or any new number to auto-register), and hit **Send OTP Code**.
2. **Accessing the code:** Switch to your **backend console/terminal window** running the dotnet Web API. Look for the dispatched SMS Simulator banner:
   ```
   ==================================================
   [SMS GATEWAY SIMULATOR] Dispatched OTP code '4827' to phone '9999999999'
   ==================================================
   ```
3. **Submitting the code:** Enter `4827` on the website prompt to retrieve your JWT token and establish your session.

---

## 💎 Core Architecture Highlights

### ⚡ Server-Side Query Execution & Infinite Scroll
Instead of fetching all products and filtering them on the client, the platform uses server-side querying:
* The frontend uses a DOM sentinel `IntersectionObserver` element. When scrolled to the bottom of `/shop`, it calls `loadMore()` to request the next page chunk (12 items) from the database.
* The API runs optimized `Skip((page - 1) * pageSize).Take(pageSize)` queries against SQL Server, sending only the necessary data payloads.

### 🛡️ ACID Transactions in Order Checkouts
* Placing an order checks inventory levels. To prevent overselling under high concurrent traffic, the checkout endpoint is wrapped in a database Transaction Scope (`BeginTransactionAsync`).
* If any step fails (such as stock depletion for any cart item), the entire transaction rolls back cleanly, maintaining database integrity.

### 🗃️ Normalized Category Schema
* Categories are normalized into a dedicated `Categories` table mapped by foreign keys in the `Products` table.
* The frontend sidebar categories update dynamically to show only categories containing products matching your active search string.
