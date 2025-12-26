# API Documentation - HU Anti-HIV/AIDS Club Platform

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Public Endpoints

### Anonymous Questions

#### Submit Anonymous Question
```http
POST /anonymous-questions
```

**Body:**
```json
{
  "question": "What are the symptoms of HIV?",
  "category": "general"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Question submitted successfully",
  "data": {
    "_id": "question_id",
    "question": "What are the symptoms of HIV?",
    "category": "general",
    "isAnswered": false,
    "createdAt": "2025-12-22T10:00:00.000Z"
  }
}
```

#### Get All Answered Questions
```http
GET /anonymous-questions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "question_id",
      "question": "What are the symptoms of HIV?",
      "answer": {
        "content": "Common symptoms include...",
        "answeredBy": "admin_id",
        "answeredAt": "2025-12-22T11:00:00.000Z"
      },
      "category": "general",
      "isAnswered": true
    }
  ]
}
```

---

## Authentication Endpoints

### Register
```http
POST /auth/register
```

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "department": "Computer Science",
  "year": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["member"]
    },
    "token": "jwt_token_here"
  }
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "roles": ["member"]
    },
    "token": "jwt_token_here"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["member"]
  }
}
```

---

## Member Endpoints

All member endpoints require authentication.

### Events

#### Get All Events
```http
GET /events
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (published, draft, cancelled)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "event_id",
      "title": "HIV Awareness Workshop",
      "description": "Learn about HIV prevention",
      "eventType": "workshop",
      "startDate": "2025-12-25T09:00:00.000Z",
      "endDate": "2025-12-25T17:00:00.000Z",
      "location": {
        "venue": "Main Hall"
      },
      "registrations": [],
      "status": "published"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalDocs": 50
  }
}
```

#### Register for Event
```http
POST /events/:id/register
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": {
    "event": "event_id",
    "user": "user_id",
    "registrationDate": "2025-12-22T10:00:00.000Z"
  }
}
```

### Stories

#### Get All Stories
```http
GET /stories
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`, `limit`, `category`, `status`

**Response:**
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "_id": "story_id",
        "title": "My Journey",
        "content": "Story content...",
        "author": {
          "_id": "user_id",
          "firstName": "John",
          "lastName": "Doe"
        },
        "category": "personal_journey",
        "status": "published",
        "likes": [],
        "views": 150
      }
    ]
  }
}
```

#### Like Story
```http
POST /stories/:id/like
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Story liked successfully",
  "data": {
    "totalLikes": 15
  }
}
```

### Gallery

#### Get All Gallery Items
```http
GET /gallery
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "galleries": [
      {
        "_id": "gallery_id",
        "title": "Awareness Campaign 2025",
        "images": [
          {
            "url": "https://example.com/image.jpg",
            "caption": "Event photo"
          }
        ],
        "albumType": "event",
        "likes": [],
        "comments": []
      }
    ]
  }
}
```

#### Like Gallery Item
```http
POST /gallery/:id/like
Authorization: Bearer <token>
```

#### Comment on Gallery Item
```http
POST /gallery/:id/comment
Authorization: Bearer <token>
```

**Body:**
```json
{
  "content": "Great event!"
}
```

### Resources

#### Get All Resources
```http
GET /resources
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "resource_id",
      "title": "HIV Prevention Guide",
      "description": "Comprehensive guide on HIV prevention",
      "resourceType": "document",
      "fileUrl": "https://example.com/guide.pdf",
      "category": "education",
      "status": "approved"
    }
  ]
}
```

#### Download Resource
```http
GET /resources/:id/download
Authorization: Bearer <token>
```

### Profile

#### Get Own Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update Own Profile
```http
PUT /users/profile
Authorization: Bearer <token>
```

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "department": "Computer Science",
  "bio": "Updated bio",
  "interests": ["HIV awareness", "peer education"]
}
```

---

## Admin Endpoints

All admin endpoints require authentication with admin role.

### Dashboard

#### Get Dashboard Statistics
```http
GET /admin/dashboard/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "active": 120
    },
    "events": {
      "total": 25,
      "upcoming": 5
    },
    "sessions": {
      "total": 40
    },
    "stories": {
      "total": 60,
      "pending": 8
    },
    "resources": {
      "total": 35
    }
  }
}
```

#### Get Recent Activity
```http
GET /admin/dashboard/recent-activity?limit=10
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recentUsers": [],
    "recentEvents": [],
    "recentStories": []
  }
}
```

### User Management

#### Get All Users
```http
GET /admin/users?page=1&limit=20&search=john
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `role`: Filter by role
- `status`: Filter by membership status
- `search`: Search by name, email, or username

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["member"],
      "isActive": true,
      "membershipStatus": "active"
    }
  ],
  "totalPages": 8,
  "currentPage": 1,
  "total": 150
}
```

#### Get User by ID
```http
GET /admin/users/:id
Authorization: Bearer <admin_token>
```

#### Update User Roles
```http
PATCH /admin/users/:id/roles
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "roles": ["member", "peer_educator"]
}
```

#### Update User Status
```http
PATCH /admin/users/:id/status
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "membershipStatus": "active",
  "isActive": true
}
```

#### Delete User
```http
DELETE /admin/users/:id
Authorization: Bearer <admin_token>
```

### Event Management

#### Get Event Attendees
```http
GET /admin/events/:id/attendees
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "event_id",
      "title": "HIV Workshop",
      "startDate": "2025-12-25T09:00:00.000Z"
    },
    "attendees": [
      {
        "user": {
          "_id": "user_id",
          "firstName": "John",
          "lastName": "Doe"
        },
        "attended": true,
        "registrationDate": "2025-12-20T10:00:00.000Z"
      }
    ]
  }
}
```

#### Mark Attendance
```http
PATCH /admin/events/:eventId/attendees/:userId
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "attended": true
}
```

#### Get Attendance Report
```http
GET /admin/events/attendance/report?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "eventId": "event_id",
      "title": "HIV Workshop",
      "date": "2025-12-25T09:00:00.000Z",
      "totalRegistrations": 50,
      "totalAttended": 45,
      "attendanceRate": "90.0"
    }
  ]
}
```

### Session Management

#### Get Session Attendees
```http
GET /admin/sessions/:id/attendees
Authorization: Bearer <admin_token>
```

#### Mark Session Attendance
```http
PATCH /admin/sessions/:sessionId/attendees/:userId
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "attended": true
}
```

### Content Management

#### Get Pending Content
```http
GET /admin/content/pending
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stories": [],
    "resources": [],
    "galleries": []
  }
}
```

#### Approve Content
```http
PATCH /admin/content/:type/:id/approve
Authorization: Bearer <admin_token>
```

**Parameters:**
- `type`: story, resource, or gallery
- `id`: Content ID

**Body:**
```json
{
  "notes": "Approved for publication"
}
```

#### Reject Content
```http
PATCH /admin/content/:type/:id/reject
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "notes": "Content does not meet guidelines"
}
```

### System Settings

#### Get System Settings
```http
GET /admin/settings
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "siteName": "HU Anti-HIV/AIDS Club",
    "siteDescription": "Platform description",
    "contactEmail": "contact@example.com",
    "contactPhone": "+251912345678",
    "socialMedia": {
      "facebook": "https://facebook.com/...",
      "twitter": "https://twitter.com/...",
      "instagram": "https://instagram.com/..."
    },
    "features": {
      "enableRegistration": true,
      "enableStories": true,
      "requireContentApproval": true
    },
    "security": {
      "maxLoginAttempts": 5,
      "sessionTimeout": 3600,
      "passwordMinLength": 6
    }
  }
}
```

#### Update System Settings
```http
PATCH /admin/settings
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "siteName": "Updated Name",
  "contactEmail": "new@example.com",
  "features": {
    "enableRegistration": false
  }
}
```

### Reports

#### Get Users Report
```http
GET /admin/reports/users
Authorization: Bearer <admin_token>
```

#### Get Events Report
```http
GET /admin/reports/events
Authorization: Bearer <admin_token>
```

#### Get Sessions Report
```http
GET /admin/reports/sessions
Authorization: Bearer <admin_token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Public endpoints:** 100 requests per 15 minutes per IP
- **Authenticated endpoints:** 1000 requests per 15 minutes per user
- **Admin endpoints:** 5000 requests per 15 minutes per admin

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Format:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalDocs": 100,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## File Uploads

File uploads use multipart/form-data:

```http
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: The file to upload
- `type`: File type (image, document, video)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/file.jpg",
    "filename": "file.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg"
  }
}
```

---

## Webhooks (Future Feature)

Webhook endpoints for external integrations:

- `POST /webhooks/payment` - Payment notifications
- `POST /webhooks/email` - Email delivery status
- `POST /webhooks/sms` - SMS delivery status

---

## API Versioning

Current version: v1

Future versions will be accessible via:
```
/api/v2/endpoint
```

---

## Support

For API support, contact:
- Email: dev@example.com
- Documentation: https://docs.example.com
- Status Page: https://status.example.com

---

**Last Updated:** December 22, 2025
**API Version:** 1.0.0
