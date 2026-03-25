# MongoDB Setup Guide

## Overview
Added MongoDB integration to both **Food Service** and **User Service** microservices.

## Changes Made

### 1. **Dependencies Added**
- `mongoose` (^8.0.0) - MongoDB object modeling
- `dotenv` (^16.0.3) - Environment variable management

### 2. **Database Connection**
- `services/food-service/db.js` - MongoDB connection for Food Service
- `services/user-service/db.js` - MongoDB connection for User Service

### 3. **Data Models**
- `services/food-service/models/Food.js` - Food document schema
  - Fields: name, category, price, description, createdAt, updatedAt
  
- `services/user-service/models/User.js` - User document schema
  - Fields: email, name, password, createdAt, updatedAt

### 4. **Updated Services**
- **Food Service (port 4002)**
  - POST `/` - Create food with MongoDB
  - GET `/` - Fetch all foods
  - GET `/search` - Search foods using MongoDB regex
  - GET `/categories` - Get distinct categories
  - PUT `/:id` - Update food by MongoDB ID
  - DELETE `/:id` - Delete food by MongoDB ID

- **User Service (port 4001)**
  - POST `/register` - Register user with MongoDB uniqueness constraint
  - GET `/` - Fetch all users (password excluded)
  - POST `/login` - Authenticate user

### 5. **Configuration Files**
- `.env` files in each service with MongoDB URI configuration
- `.env.example` for reference

## Installation & Setup

1. **Install dependencies:**
   ```bash
   cd services/food-service && npm install
   cd services/user-service && npm install
   ```

2. **Start MongoDB:**
   - For local: `mongod` (default: mongodb://localhost:27017)
   - For MongoDB Atlas: Update MONGO_URI in `.env` file

3. **Start services:**
   ```bash
   # Terminal 1 - Food Service
   cd services/food-service && node index.js
   
   # Terminal 2 - User Service
   cd services/user-service 
   node index.js
   
   # Terminal 3 - Gateway
   cd gateway && npm start
   ```

## API Changes
- IDs are now MongoDB ObjectIds instead of incremental numbers
- All routes are now async with proper error handling
- Unique constraint on user email field
- Updated query methods using MongoDB operators ($regex, $or, distinct, etc.)

## Notes
- Passwords are stored as plain text in the current implementation. For production, use bcrypt for hashing.
- Add `.env` to `.gitignore` to prevent exposing credentials.
