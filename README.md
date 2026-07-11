# Restaurant Management System

A full-stack web application developed during my internship at **KANINI Software Solutions Pvt. Ltd.** to streamline restaurant operations through a centralized digital platform.

---

## 📌 Project Overview

The Restaurant Management System is designed to automate various restaurant operations, including menu management, order processing, kitchen workflow, billing, and user management.

The application provides dedicated modules for different user roles, ensuring smooth communication and efficient workflow across the restaurant.

---

## ✨ Features

### Admin
- Dashboard
- User Management
- Menu Management
- Category Management
- Table Management
- Order Monitoring

### Waiter
- View Assigned Tables
- Browse Menu
- Search & Filter Menu Items
- Add Items to Cart
- Place Orders
- View Order Status
- Order History

### Kitchen
- Kitchen TV
- Kitchen Device
- View Active Orders
- Update Order Status
- Automatic Order Refresh

### Cashier
- View Pending Orders
- Generate Bills
- Complete Payments
- Payment History

---

## 🛠️ Technology Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript (ES6)

### Backend
- ASP.NET Core Web API
- C#

### Database
- Microsoft SQL Server
- Entity Framework Core (Code First)

### Tools
- Visual Studio 2022
- Visual Studio Code
- SQL Server Management Studio (SSMS)
- Swagger
- Git
- GitHub
- Figma

---
## 🏗️ Project Architecture

```text
React Frontend
       │
       ▼
ASP.NET Core Web API
       │
       ▼
Controllers
       │
       ▼
Services
       │
       ▼
Repositories
       │
       ▼
SQL Server Database
```

## 🚀 Getting Started

### Prerequisites

- Visual Studio 2022
- SQL Server
- .NET SDK
- Node.js
- npm

---

### Backend Setup

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Open the backend solution in Visual Studio.

3. Update the SQL Server connection string in:

```
appsettings.json
```

4. Apply Entity Framework migrations.

```powershell
Update-Database
```

5. Run the API.

Swagger will open automatically.

---

### Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend/restaurant-management
```

Install dependencies.

```bash
npm install
```

Run the application.

```bash
npm run dev
```

---


## Login

Create users through the Admin module or update the database with sample users before logging in.

---

## 👩‍💻 Developed By

**Hemavarshini Sivakumar**

Intern – Product Engineering

KANINI Software Solutions Pvt. Ltd.

---

## 📄 Internship Project

This project was developed as part of my Product Engineering Internship at KANINI Software Solutions Pvt. Ltd.
