# BMPL Full-Stack Application

A comprehensive full-stack TypeScript application with React frontend and Node.js/Express backend. Features a complete CRUD (Create, Read, Update, Delete) interface for managing items with authentication, database integration, pagination, and search functionality.

## Features

### Core Features
- ✅ **Full CRUD Operations**: Create, read, update, and delete items
- 🎨 **Modern UI**: Beautiful, responsive design with gradient backgrounds
- 📊 **Status Management**: Track items as Active, Completed, or Archived
- 🔥 **Priority Levels**: Organize items by Low, Medium, or High priority
- 🔄 **Real-time Updates**: Automatic refresh and state management
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎯 **Type Safety**: Full TypeScript implementation across frontend and backend

### Advanced Features
- 🔐 **JWT Authentication**: Secure user authentication with JSON Web Tokens
- 👤 **User Management**: Register and login functionality with protected routes
- 💾 **MongoDB Database**: Persistent data storage with Mongoose ODM
- 📄 **Pagination**: Efficient handling of large item lists with page navigation
- 🔍 **Search Functionality**: Full-text search across item titles and descriptions
- 🔒 **Protected Routes**: API endpoints secured with authentication middleware
- 🔑 **Token-based Auth**: Secure token storage and automatic token refresh

## Project Structure

```
bmpl-project/
├── backend/          # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts              # Main server file
│   │   ├── config/
│   │   │   └── database.ts       # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.ts           # User model
│   │   │   └── BmplItem.ts       # Item model
│   │   ├── types/                # TypeScript interfaces
│   │   │   └── BmplItem.ts
│   │   ├── services/             # Business logic
│   │   │   └── BmplService.ts    # Item service with pagination & search
│   │   ├── routes/               # API routes
│   │   │   ├── authRoutes.ts     # Authentication routes
│   │   │   └── bmplRoutes.ts     # Item CRUD routes
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT authentication middleware
│   │   └── utils/
│   │       └── jwt.ts            # JWT utilities
│   ├── .env                      # Environment variables
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # React + TypeScript
│   ├── src/
│   │   ├── App.tsx               # Main app component
│   │   ├── components/           # React components
│   │   │   ├── BmplItemCard.tsx
│   │   │   ├── BmplItemCard.css
│   │   │   ├── BmplItemForm.tsx
│   │   │   ├── BmplItemForm.css
│   │   │   ├── Login.tsx         # Login component
│   │   │   ├── Register.tsx      # Register component
│   │   │   └── Auth.css          # Auth styles
│   │   ├── services/             # API client
│   │   │   ├── bmplApi.ts        # Item API with pagination & search
│   │   │   └── authApi.ts        # Authentication API
│   │   ├── types/                # TypeScript interfaces
│   │   │   ├── BmplItem.ts
│   │   │   └── Auth.ts
│   │   ├── utils/
│   │   │   └── token.ts          # Token management utilities
│   │   ├── index.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (v4.4 or higher)
  - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
  - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud-hosted)

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sarvinp/bmpl-project.git
cd bmpl-project
```

### Step 2: Set Up Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development

   # MongoDB Connection
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/bmpl-db
   # For MongoDB Atlas (cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bmpl-db

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

5. Start MongoDB (if using local installation):
   ```bash
   # Windows
   mongod

   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Step 3: Set Up Frontend

1. Open a **new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

### Authentication Endpoints (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Item Endpoints (`/api/bmpl`)

All item endpoints require authentication (Bearer token in Authorization header).

- `GET /api/bmpl` - Get all items (with pagination and search)
  - Query parameters:
    - `page` (number): Page number (default: 1)
    - `limit` (number): Items per page (default: 10)
    - `q` (string): Search query
    - `status` (string): Filter by status (active, completed, archived)
    - `priority` (string): Filter by priority (low, medium, high)
- `GET /api/bmpl/:id` - Get item by ID
- `POST /api/bmpl` - Create new item
- `PUT /api/bmpl/:id` - Update item
- `DELETE /api/bmpl/:id` - Delete item

### Request/Response Examples

**Register User:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response: (same as register)
```

**Get Items with Pagination:**
```json
GET /api/bmpl?page=1&limit=10&q=test&status=active

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Create Item:**
```json
POST /api/bmpl
Headers: { "Authorization": "Bearer <token>" }
{
  "title": "My Item",
  "description": "Item description",
  "priority": "high"
}
```

## Available Scripts

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `dist/`)
- `npm start` - Start production server (requires build first)
- `npm run type-check` - Type check without building

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Database Schema

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string (required)
  createdAt: Date
  updatedAt: Date
}
```

### BmplItem Model
```typescript
{
  title: string (required)
  description: string (required)
  status: 'active' | 'completed' | 'archived' (default: 'active')
  priority: 'low' | 'medium' | 'high' (default: 'medium')
  user: ObjectId (reference to User, required)
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- Text index on `title` and `description` for search
- Index on `user` and `status` for filtering
- Index on `user` and `priority` for filtering
- Index on `user` and `createdAt` for sorting

## Security Features

- 🔒 **Password Hashing**: Passwords are hashed using bcryptjs before storage
- 🔑 **JWT Tokens**: Secure token-based authentication
- 🛡️ **Protected Routes**: All item endpoints require valid JWT token
- 🚫 **CORS Protection**: Configured for secure cross-origin requests
- ✅ **Input Validation**: Server-side validation for all inputs

## Usage Guide

### First Time Setup

1. **Start MongoDB**: Ensure MongoDB is running locally or configure MongoDB Atlas URI
2. **Start Backend**: Run `npm run dev` in the backend directory
3. **Start Frontend**: Run `npm start` in the frontend directory
4. **Register Account**: Create a new account on the registration page
5. **Login**: Use your credentials to login
6. **Create Items**: Start creating and managing your items!

### Using the Application

1. **Creating Items**: Click "Create New Item" button, fill in the form, and submit
2. **Searching**: Use the search bar to find items by title or description
3. **Filtering**: Use the Status and Priority dropdowns to filter items
4. **Pagination**: Navigate through pages using Previous/Next buttons
5. **Editing**: Click "Edit" on any item card to modify it
6. **Completing**: Click "Complete" to mark items as done
7. **Deleting**: Click "Delete" (with confirmation) to remove items

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/bmpl-db` |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |
| `JWT_EXPIRE` | JWT token expiration | `7d` |

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod` or check MongoDB service status
   - Verify `MONGODB_URI` in `.env` is correct
   - Check MongoDB logs for connection issues

2. **Port Already in Use**
   - Change the `PORT` in backend `.env` file
   - Or stop the process using the port

3. **Authentication Errors**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration settings
   - Verify token is being sent in Authorization header

4. **CORS Errors**
   - Ensure backend is running
   - Check CORS configuration in backend
   - Verify frontend is using correct API URL

5. **Type Errors**
   - Run `npm run type-check` in backend
   - Check TypeScript errors in frontend terminal

6. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (requires v16+)

## Production Deployment

### Backend Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name bmpl-backend
   ```

### Frontend Deployment

1. Build for production:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to a static hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

### Database Setup

- Use MongoDB Atlas for cloud-hosted database
- Update `MONGODB_URI` with your Atlas connection string
- Configure database backups and monitoring

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **ts-node-dev** - Development server with hot reload
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Modern styling with gradients and animations
- **Fetch API** - HTTP client
- **LocalStorage** - Token storage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

---

Built with ❤️ using React, TypeScript, Node.js, Express, and MongoDB
