# Anti-HIV-AIDS-CLUBS Server Setup Guide

## Quick Start Guide

Follow these steps to set up and run the server:

### Step 1: Install Dependencies

Open terminal in the server directory and run:

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- joi
- cors
- helmet
- express-rate-limit
- dotenv

### Step 2: Set Up Environment Variables

Copy the `.env.example` file to create your `.env` file:

```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

Then edit the `.env` file with your configuration:

**Required Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anti-hiv-aids-clubs
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

### Step 3: Start MongoDB

Make sure MongoDB is running on your system.

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows: MongoDB should be running as a service
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string

### Step 4: Run the Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

### Step 5: Test the Server

Open your browser or use curl to test:

**Health Check:**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-12-21T...",
  "environment": "development"
}
```

**Register a User:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

This will return a JWT token. Use this token for authenticated requests.

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running
2. Check your `MONGODB_URI` in `.env`
3. For local MongoDB: `mongodb://localhost:27017/anti-hiv-aids-clubs`
4. For MongoDB Atlas: Use the connection string from Atlas

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change the `PORT` in `.env` to a different port (e.g., 5001)
2. Or kill the process using port 5000

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
1. Make sure you ran `npm install`
2. Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Testing with Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import the API endpoints or create requests manually
3. For protected routes, add Authorization header:
   - Key: `Authorization`
   - Value: `Bearer <your-jwt-token>`

## Next Steps

1. ✅ Server is running
2. ✅ Database is connected
3. ✅ Test user registration and login
4. 📝 Create initial admin user
5. 📝 Test all API endpoints
6. 📝 Connect frontend application
7. 📝 Deploy to production

## Production Deployment

Before deploying to production:

1. **Change JWT_SECRET** to a secure random string
2. **Set NODE_ENV** to `production`
3. **Use MongoDB Atlas** or a production MongoDB instance
4. **Enable HTTPS**
5. **Set up proper CORS** with your production frontend URL
6. **Configure rate limiting** appropriately
7. **Set up logging** and monitoring
8. **Use environment-specific .env files**

## Useful Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## API Documentation

See [README.md](./README.md) for complete API documentation.

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed

## File Structure

```
server/
├── config/              # Configuration files
├── middleware/          # Express middleware
├── models/             # Mongoose models
├── modules/            # Feature modules
│   ├── users/
│   ├── members/
│   ├── advisors/
│   ├── peerEducators/
│   ├── events/
│   └── anonymousQuestions/
├── .env                # Environment variables (create this)
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
├── README.md           # Documentation
├── SETUP.md           # This file
└── server.js          # Main application
```

Happy coding! 🚀
