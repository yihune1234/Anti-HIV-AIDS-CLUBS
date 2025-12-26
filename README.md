# HU Anti-HIV/AIDS Club Platform

A comprehensive web platform for managing the Haramaya University Anti-HIV/AIDS Club activities, events, resources, and member engagement.

## 🌟 Features

### Public Features
- **Home Page** - Welcome and overview of the club
- **About Page** - Club history, mission, and president information
- **Vision Page** - Goals and objectives
- **Awareness Page** - HIV/AIDS education and awareness content
- **Anonymous Questions** - Submit questions anonymously
- **User Registration** - Create member accounts

### Member Features
- **Dashboard** - Personalized member dashboard
- **Events** - View and register for club events
- **Stories** - Read and interact with member stories
- **Gallery** - View event photos and activities
- **Resources** - Access educational materials and documents
- **Profile Management** - Update personal information

### Admin Features
- **Dashboard** - Real-time statistics and analytics
- **User Management** - Manage members, roles, and permissions
- **Event Management** - Create, edit, and track events
- **Content Approval** - Review and approve stories, resources, and gallery items
- **System Settings** - Configure platform settings and features
- **Reports** - Generate comprehensive reports with CSV export
- **Attendance Tracking** - Mark and track event/session attendance

## 🏗️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hu-hiv-aids-club.git
cd hu-hiv-aids-club
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hiv-aids-club
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## 👤 Default Admin Setup

After installation, create an admin account:

1. Register a new user through the registration page
2. Connect to MongoDB and update the user's role:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { roles: ["admin"] } }
)
```

3. Login with the admin credentials to access the admin panel at `/admin`

## 📁 Project Structure

```
hu-hiv-aids-club/
├── server/                 # Backend application
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── modules/           # Feature modules
│   │   ├── admin/        # Admin functionality
│   │   ├── auth/         # Authentication
│   │   ├── events/       # Events management
│   │   ├── gallery/      # Gallery management
│   │   ├── resources/    # Resources management
│   │   └── stories/      # Stories management
│   ├── server.js         # Entry point
│   └── package.json
│
├── client/                # Frontend application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── assets/       # Images, fonts, etc.
│   │   ├── components/   # Reusable components
│   │   │   ├── guard/   # Route guards
│   │   │   └── layout/  # Layout components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   │   ├── admin/   # Admin pages
│   │   │   ├── auth/    # Auth pages
│   │   │   ├── member/  # Member pages
│   │   │   └── public/  # Public pages
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── package.json
│
├── ACCESS_CONTROL_TABLE.md    # Access control matrix
├── API_DOCUMENTATION.md        # API documentation
├── DEPLOYMENT_CHECKLIST.md     # Deployment guide
├── TESTING_GUIDE.md           # Testing instructions
└── README.md                  # This file
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt encryption for passwords
- **Role-Based Access Control** - Granular permissions system
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured CORS policies
- **Rate Limiting** - API rate limiting to prevent abuse
- **Session Management** - Configurable session timeouts

## 🎯 User Roles

### Public
- View public pages
- Submit anonymous questions
- Register for membership

### Member
- All public access
- View events, stories, gallery, resources
- Register for events and sessions
- Like and comment on content
- Manage personal profile

### Admin
- All member access
- Full CRUD operations on all content
- User management and role assignment
- Content approval workflow
- System configuration
- Generate reports and analytics
- Attendance tracking

## 📊 Key Features Detail

### Dashboard Analytics
- Total users and active members
- Upcoming and total events
- Education sessions count
- Pending content for review
- Recent activity feed

### Content Management
- **Stories** - Member stories with approval workflow
- **Resources** - Educational materials and documents
- **Gallery** - Event photos with likes and comments
- **Events** - Event creation and registration system

### Reporting System
- User reports with CSV export
- Event attendance reports
- Session participation metrics
- Date-range filtered reports
- Visual attendance indicators

### System Settings
- Site branding and contact information
- Social media integration
- Feature toggles
- Security policies
- Notification preferences

## 🧪 Testing

Run backend tests:
```bash
cd server
npm test
```

Run frontend tests:
```bash
cd client
npm test
```

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing instructions.

## 📦 Deployment

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for complete deployment instructions.

### Quick Deploy

#### Backend (Render/Railway/Heroku)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

#### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## 🔧 Configuration

### System Settings (Admin Panel)
- Site name and description
- Contact email and phone
- Social media links
- Feature toggles
- Security settings
- Notification preferences

### Environment Variables

**Backend:**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - Token expiration time
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS

**Frontend:**
- `VITE_API_URL` - Backend API URL

## 📖 API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

### Quick API Reference

**Public:**
- `POST /api/anonymous-questions` - Submit question
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login

**Member:**
- `GET /api/events` - Get events
- `GET /api/stories` - Get stories
- `GET /api/gallery` - Get gallery
- `GET /api/resources` - Get resources

**Admin:**
- `GET /api/admin/dashboard/stats` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/roles` - Update roles
- `GET /api/admin/content/pending` - Pending content
- `GET /api/admin/reports/users` - User report

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

### Club Leadership
- **President:** Meraol Abdulkader
- **Email:** [Club Email]
- **Phone:** [Club Phone]

### Development Team
- **Developer:** [Your Name]
- **Email:** [Your Email]

## 📞 Support

For technical support or questions:
- **Email:** support@example.com
- **Documentation:** See docs folder
- **Issues:** GitHub Issues

## 🙏 Acknowledgments

- Haramaya University
- HU Anti-HIV/AIDS Club Members
- All contributors and supporters

## 📅 Version History

### Version 1.0.0 (December 2025)
- Initial release
- Complete admin panel
- Member dashboard
- Public pages
- Authentication system
- Content management
- Reporting system
- System settings

## 🔮 Future Enhancements

- [ ] Email notifications
- [ ] SMS integration
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Payment integration for events
- [ ] Certificate generation
- [ ] Volunteer hour tracking
- [ ] Social media integration
- [ ] Real-time chat support

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### Member Dashboard
![Member Dashboard](screenshots/member-dashboard.png)

---

**Built with ❤️ for Haramaya University Anti-HIV/AIDS Club**

**Last Updated:** December 22, 2025
**Version:** 1.0.0
