# 🛠️ Fix: Get MongoDB Running (Root Cause Solution)

## The Problem
Your application requires MongoDB to work. The "Registering..." button hangs because **MongoDB is not running**.

## The Solution: 3 Simple Steps

### Step 1: Install MongoDB

**Download MongoDB Community Edition:**
https://www.mongodb.com/try/download/community

Select **Windows** and download the `.msi` installer.

**Run the installer:**
- Double-click the downloaded `.msi` file
- Click "Next" through the setup
- Choose **"Install MongoDB as a Service"** 
- Complete installation

**Verify installation:**
```powershell
mongod --version
```
You should see the version number.

---

### Step 2: Start MongoDB

Open a **new terminal** and run:

```powershell
mongod
```

Wait for the output to show:
```
Waiting for connections on port 27017
```

**Keep this terminal open!** MongoDB must be running while you use the app.

---

### Step 3: Start Your Services

In **separate terminals**, run:

**Terminal 2: User Service**
```powershell
cd services\user-service
npm install
node index.js
```

**Terminal 3: Book Service**
```powershell
cd services\book-service
npm install
node index.js
```

**Terminal 4: Gateway**
```powershell
cd gateway
npm install
node index.js
```

**Terminal 5: React Client**
```powershell
cd client
npm install
npm run dev
```

---

## ✅ Test Registration

1. Open: http://localhost:5173
2. Click "👥 Users" tab
3. Fill the form:
   - Name: `test`
   - Email: `test@example.com`
   - Password: `password`
4. Click "Register New User"
5. **Result:** ✅ Should register instantly!

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Registering..." still hangs | MongoDB not running - check Terminal 1 |
| "Cannot connect to MongoDB" | Run `mongod` in Terminal 1 |
| Service won't start | Delete `node_modules`, run `npm install` again |
| Port already in use | Close other terminals, run `taskkill /F /IM node.exe` |

---

## Why This Fixes It

1. **MongoDB is installed** - Services can connect to it
2. **MongoDB is running** - `mongod` stays open in Terminal 1
3. **Services connect immediately** - No timeouts or errors
4. **Registration works instantly** - Data is saved to MongoDB

**No timeouts, no workarounds, just proper MongoDB setup!**
