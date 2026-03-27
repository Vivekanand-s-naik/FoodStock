# Troubleshooting Guide

## Issue: "Registering..." Button Gets Stuck

### Root Cause
The web app hangs when trying to register a user because **MongoDB is not running** on your system.

### Solution

#### Step 1: Install MongoDB Community Edition
If you haven't installed MongoDB yet:

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will be installed at: `C:\Program Files\MongoDB\Server\VERSION\`

#### Step 2: Start MongoDB
Run MongoDB in a **new terminal** before starting your services:

**Option A: Using MongoDB Service (Windows)**
```powershell
# Start MongoDB service (if installed as service)
net start MongoDB
```

**Option B: Run MongoDB Manually**
```powershell
# Navigate to MongoDB binary directory
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Start mongod
mongod
```

You should see output like:
```
Waiting for connections on port 27017
```

#### Step 3: Verify MongoDB is Running
Open a new terminal and test the connection:

```powershell
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongo
```

You should see:
```
MongoDB shell version v7.0.0
connecting to: mongodb://127.0.0.1:27017/?compressors=
```

Press `Ctrl+C` to exit the mongo shell.

#### Step 4: Start Your Services (in this order)

**Terminal 1 - MongoDB**
```powershell
# Keep this running in the background
mongod
```

**Terminal 2 - User Service**
```powershell
cd services/user-service
npm install  # First time only
node index.js
```

You should see:
```
✓ MongoDB connected to User Service
User Service running on port 4001
```

**Terminal 3 - Book Service**
```powershell
cd services/book-service
npm install  # First time only
node index.js
```

You should see:
```
✓ MongoDB connected to Book Service
Book Service running on port 4002
```

**Terminal 4 - Gateway**
```powershell
cd gateway
npm install  # First time only
node index.js
```

You should see:
```
Gateway running on 4000
```

**Terminal 5 - Client (React)**
```powershell
cd client
npm install  # First time only
npm run dev
```

#### Step 5: Test Registration
1. Open browser to `http://localhost:5173` (or the URL shown by Vite)
2. Go to the "👥 Users" tab
3. Fill in: Name, Email, Password
4. Click "Register New User"
5. Should complete immediately and show "✅ User registered successfully!"

---

## Alternative: Using MongoDB Atlas (Cloud)

If you don't want to run MongoDB locally:

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
3. Update `.env` files:

**services/user-service/.env**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/user-service?retryWrites=true&w=majority
PORT=4001
```

**services/book-service/.env**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/book-service?retryWrites=true&w=majority
PORT=4002
```

Then start services normally (no mongod needed).

---

## Deprecation Warning Fix

The warning about `util._extend` is from an old dependency. To fix:

**In gateway/package.json**, ensure you have Express 5.x or update it:
```bash
cd gateway
npm install express@latest
npm start
```

This is just a warning and won't affect functionality.

---

## Checking Service Health

### Check if User Service is running:
```bash
curl http://localhost:4001/health
# Response: {"status":"ok","service":"user-service"}
```

### Check if Book Service is running:
```bash
curl http://localhost:4002/health
# Response: {"status":"ok","service":"book-service"}
```

### Check if Gateway is running:
```bash
curl http://localhost:4000/users/health
# Response should proxy to user service
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Ensure `mongod` is running in a separate terminal |
| Port 4001/4002 already in use | Change PORT in `.env` files or kill existing process |
| npm install fails | Delete `node_modules` and `package-lock.json`, run `npm install` again |
| React app won't start | Ensure gateway is running first, check `package.json` for dev server config |

---

## Reset Everything & Start Fresh

```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Delete node_modules from all folders
Remove-Item -Recurse -Force services/user-service/node_modules
Remove-Item -Recurse -Force services/book-service/node_modules
Remove-Item -Recurse -Force gateway/node_modules
Remove-Item -Recurse -Force client/node_modules

# Delete package-lock files
Remove-Item services/user-service/package-lock.json
Remove-Item services/book-service/package-lock.json
Remove-Item gateway/package-lock.json
Remove-Item client/package-lock.json

# Start fresh
npm install in each folder and run services
```
