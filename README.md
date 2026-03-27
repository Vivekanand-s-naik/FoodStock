# FoodApp - Microservices Architecture

A comprehensive React + Node.js microservices application for managing recipes, users, and orders.

## Project Structure

- **frontend/**: React + Vite frontend application.
- **api-gateway/**: Central entry point for all frontend requests.
- **user-service/**: Handles user registration and authentication.
- **recipe-service/**: Manages the recipe catalog.
- **order-service/**: Processes customer orders.
- **notification-service/**: Handles email and system notifications.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or via Docker)

### Installation
1. Clone the repository.
2. Run `npm install` in each service directory (or use the startup scripts).

### Running the App
- **Windows (PowerShell)**: `./START-ALL.ps1`
- **Windows (Batch)**: `START-ALL-WINDOWS.bat`
- **Docker**: `docker-compose up --build`

## Ports
- Gateway: 4000
- User Service: 4001
- Recipe Service: 4002
- Order Service: 4003
- Notification Service: 4004
- Frontend: 5173
