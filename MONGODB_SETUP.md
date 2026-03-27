# MongoDB Setup Guide

## Overview
Added MongoDB integration to both **Book Service** and **User Service** microservices.

## Changes Made

### 1. **Dependencies Added**
- `mongoose` (^8.0.0) - MongoDB object modeling
- `dotenv` (^16.0.3) - Environment variable management

### 2. **Database Connection**
- `services/book-service/db.js` - MongoDB connection for Book Service
- `services/user-service/db.js` - MongoDB connection for User Service

### 3. **Data Models**
- `services/book-service/models/Book.js` - Book document schema
  - Fields: name, category, price, description, createdAt, updatedAt
  
- `services/user-service/models/User.js` - User document schema
  - Fields: email, name, password, createdAt, updatedAt

### 4. **Updated Services**
- **Book Service (port 4002)**
  - POST `/` - Create book with MongoDB
  - GET `/` - Fetch all books
  - GET `/search` - Search books using MongoDB regex
  - GET `/categories` - Get distinct categories
  - PUT `/:id` - Update book by MongoDB ID
  - DELETE `/:id` - Delete book by MongoDB ID

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
   cd services/book-service && npm install
   cd services/user-service && npm install
   ```

2. **Start MongoDB:**
   - For local: `mongod` (default: mongodb://localhost:27017)
   - For MongoDB Atlas: Update MONGO_URI in `.env` file

3. **Start services:**
   ```bash
   # Terminal 1 - Book Service
   cd services/book-service && node index.js
   
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
