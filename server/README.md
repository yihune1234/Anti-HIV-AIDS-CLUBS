# Anti-HIV-AIDS-CLUBS Backend API

Backend server for the Anti-HIV-AIDS-CLUBS platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Admin, Member, Advisor, Peer Educator roles)
- 📚 Member & Advisor Management
- 🎓 Peer Educator System
- 📅 Event Management with Registration
- ❓ Anonymous Q&A System
- ✅ Input Validation with Joi
- 🛡️ Security with Helmet & Rate Limiting
- 📊 Statistics & Analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## Installation

1. **Clone the repository**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
- Set `MONGODB_URI` to your MongoDB connection string
- Set `JWT_SECRET` to a secure random string
- Configure other variables as needed

4. **Start MongoDB**
Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Run the server**

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication & Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

### Members
- `GET /api/members` - Get all members
- `GET /api/members/me` - Get my member profile
- `POST /api/members` - Create member (admin)
- `PUT /api/members/:id` - Update member
- `GET /api/members/stats` - Get statistics (admin)

### Advisors
- `GET /api/advisors` - Get all advisors
- `GET /api/advisors/:id` - Get advisor by ID
- `POST /api/advisors` - Create advisor (admin)
- `PUT /api/advisors/:id` - Update advisor (admin)

### Peer Educators
- `GET /api/peer-educators` - Get all peer educators
- `GET /api/peer-educators/:id` - Get peer educator by ID
- `POST /api/peer-educators` - Create peer educator (admin)
- `PUT /api/peer-educators/:id` - Update peer educator (admin)

### Events
- `GET /api/events` - Get all events (public)
- `GET /api/events/:id` - Get event by ID (public)
- `POST /api/events/:id/register` - Register for event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)

### Anonymous Questions
- `POST /api/questions` - Submit anonymous question (public)
- `GET /api/questions` - Get all questions (public)
- `POST /api/questions/:id/answer` - Answer question (admin/advisor)
- `POST /api/questions/:id/helpful` - Mark as helpful

## Project Structure

```
server/
├── config/
│   ├── database.js          # MongoDB connection
│   └── constants.js         # Application constants
├── middleware/
│   ├── auth.middleware.js   # Authentication & authorization
│   ├── validate.middleware.js # Input validation
│   └── error.middleware.js  # Error handling
├── models/
│   ├── User.js
│   ├── Member.js
│   ├── Advisor.js
│   ├── PeerEducator.js
│   ├── Event.js
│   ├── AnonymousQuestion.js
│   └── ... (other models)
├── modules/
│   ├── users/
│   │   ├── user.validation.js
│   │   ├── user.service.js
│   │   ├── user.controller.js
│   │   └── user.routes.js
│   ├── members/
│   ├── advisors/
│   ├── peerEducators/
│   ├── events/
│   └── anonymousQuestions/
├── .env.example
├── .gitignore
├── package.json
└── server.js               # Main application file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/anti-hiv-aids-clubs |
| `JWT_SECRET` | Secret key for JWT | (required) |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Roles

- **admin** - Full access to all resources
- **member** - Club member with limited access
- **advisor** - Faculty advisor with moderation capabilities
- **peer_educator** - Peer educator with session management access

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]  // Optional validation errors
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ MongoDB injection prevention

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Testing the API

Use tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)
- cURL

Example cURL request:
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
