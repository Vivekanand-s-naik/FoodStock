# MongoDB Setup for Windows

## Quick Start (If MongoDB is NOT installed)

### Option 1: Using MongoDB Community Edition (Recommended)

#### 1. Download MongoDB
- Go to: https://www.mongodb.com/try/download/community
- Select **Windows** and the latest stable version
- Download the `.msi` installer

#### 2. Run the Installer
- Double-click the `.msi` file
- Click "Next" through the setup wizard
- **Choose "Install MongoDB as a Service"** (recommended)
- Complete the installation

#### 3. Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

You should see the version number.

---

## Starting MongoDB

### Option 1: Using Windows Service (Easiest)
If you installed MongoDB as a service:

```powershell
# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB
```

### Option 2: Run mongod Manually
Open a **new PowerShell/CMD terminal** and run:

```powershell
mongod
```

You should see:
```
Waiting for connections on port 27017
```

**Keep this terminal open while using the application!**

---

## Verify MongoDB is Connected

### Method 1: Using mongosh (Recommended)
Open **another terminal** and run:

```powershell
mongosh
```

You should see:
```
test>
```

Type `exit` to close.

### Method 2: Using curl
```powershell
curl http://localhost:27017
```

Should show a response (not "connection refused").

---

## Complete Startup Order

Follow this **exact order** to start everything:

### Terminal 1: MongoDB (MUST BE FIRST)
```powershell
mongod
# Keep running - output should show "Waiting for connections on port 27017"
```

### Terminal 2: User Service
```powershell
cd services\user-service
npm install  # First time only
node index.js
# Should show: ✓ MongoDB connected to User Service
```

### Terminal 3: Food Service
```powershell
cd services\food-service
npm install  # First time only
node index.js
# Should show: ✓ MongoDB connected to Food Service
```

### Terminal 4: Gateway
```powershell
cd gateway
npm install  # First time only
node index.js
# Should show: Gateway running on 4000
```

### Terminal 5: React Client
```powershell
cd client
npm install  # First time only
npm run dev
# Should show: Local: http://localhost:5173
```

---

## Using the Application

1. Open browser to: **http://localhost:5173**
2. Go to **👥 Users** tab
3. Fill the registration form:
   - Name: `vivek`
   - Email: `test@example.com`
   - Password: `password123`
4. Click **Register New User**
5. Should complete instantly and show ✅ success message

---

## If Something Goes Wrong

### "Registering..." is stuck?
- Check Terminal 1 - is MongoDB running? (should see "Waiting for connections")
- Check Terminal 2 - does User Service show "✓ MongoDB connected"?
- Try restarting all services

### "Cannot connect to MongoDB"
- Is `mongod` running in Terminal 1? Start it!
- Is it saying "Error: connect ECONNREFUSED"? MongoDB isn't running.

### "Port 4001 already in use"
```powershell
# Find what's using the port
netstat -ano | findstr :4001

# Kill the process (replace PID with actual number)
taskkill /PID 1234 /F
```

### "npm install fails"
```powershell
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

---

## Troubleshooting Checklist

- [ ] MongoDB installed? (Run: `mongod --version`)
- [ ] MongoDB running? (Terminal 1 should show "Waiting for connections")
- [ ] User Service connected? (Terminal 2 should show "✓ MongoDB connected")
- [ ] Food Service connected? (Terminal 3 should show "✓ MongoDB connected")
- [ ] Gateway running? (Terminal 4 should show "Gateway running on 4000")
- [ ] React app running? (Terminal 5 should show localhost URL)
- [ ] Ports not in use? (4000, 4001, 4002, 27017)

---

## Useful Commands

```powershell
# Check if MongoDB service is installed
Get-Service MongoDB

# Start service if installed
Start-Service MongoDB

# Stop service
Stop-Service MongoDB

# Kill all node processes
taskkill /F /IM node.exe

# Check port usage
netstat -ano | findstr :27017  # MongoDB
netstat -ano | findstr :4000   # Gateway
netstat -ano | findstr :4001   # User Service
netstat -ano | findstr :4002   # Food Service
```

---

## Cloud Alternative (MongoDB Atlas)

If you don't want MongoDB locally, use MongoDB Atlas cloud:

1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string: `mongodb+srv://...`
4. Update `.env` files with the connection string
5. **No need to run `mongod` locally!**

The services will connect to the cloud MongoDB instead.
