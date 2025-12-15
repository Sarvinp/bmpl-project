# BMPL Full-Stack Application

A comprehensive full-stack TypeScript application with React frontend and Node.js/Express backend. Features a complete CRUD (Create, Read, Update, Delete) interface for managing items with status tracking, priority levels, and modern UI.

## Features

- ✅ **Full CRUD Operations**: Create, read, update, and delete items
- 🎨 **Modern UI**: Beautiful, responsive design with gradient backgrounds
- 📊 **Status Management**: Track items as Active, Completed, or Archived
- 🔥 **Priority Levels**: Organize items by Low, Medium, or High priority
- 🔄 **Real-time Updates**: Automatic refresh and state management
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 💾 **Data Persistence**: JSON-based file storage (easily upgradeable to database)
- 🎯 **Type Safety**: Full TypeScript implementation across frontend and backend

## Project Structure

```
bmpl-project/
├── backend/          # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts          # Main server file
│   │   ├── types/            # TypeScript interfaces
│   │   │   └── BmplItem.ts
│   │   ├── services/         # Business logic
│   │   │   └── BmplService.ts
│   │   └── routes/           # API routes
│   │       └── bmplRoutes.ts
│   ├── data/                 # JSON data storage (auto-created)
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # React + TypeScript
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   ├── components/       # React components
│   │   │   ├── BmplItemCard.tsx
│   │   │   ├── BmplItemCard.css
│   │   │   ├── BmplItemForm.tsx
│   │   │   └── BmplItemForm.css
│   │   ├── services/         # API client
│   │   │   └── bmplApi.ts
│   │   ├── types/            # TypeScript interfaces
│   │   │   └── BmplItem.ts
│   │   ├── index.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## API Endpoints

### Backend API (`http://localhost:5000/api/bmpl`)

- `GET /api/bmpl` - Get all items
- `GET /api/bmpl/:id` - Get item by ID
- `POST /api/bmpl` - Create new item
- `PUT /api/bmpl/:id` - Update item
- `DELETE /api/bmpl/:id` - Delete item
- `GET /api/health` - Health check

### Request/Response Format

**Create Item:**
```json
POST /api/bmpl
{
  "title": "My Item",
  "description": "Item description",
  "priority": "high"  // optional: "low" | "medium" | "high"
}
```

**Update Item:**
```json
PUT /api/bmpl/:id
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "completed",  // "active" | "completed" | "archived"
  "priority": "low"
}
```

## Step-by-Step Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm

### Step 1: Set Up Backend

1. Navigate to the backend directory:
   ```powershell
   cd C:\Users\nematpour\bmpl-project\backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. The `.env` file is already created with `PORT=5000`. You can modify it if needed.

4. Start the development server:
   ```powershell
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Step 2: Set Up Frontend

1. Open a **new terminal** and navigate to the frontend directory:
   ```powershell
   cd C:\Users\nematpour\bmpl-project\frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm start
   ```

   The frontend will run on `http://localhost:3000` and automatically open in your browser.

### Step 3: Use the Application

1. **Create Items**: Click "Create New Item" button
2. **View Items**: Items are displayed in cards with their details
3. **Edit Items**: Click "Edit" button on any item card
4. **Complete Items**: Click "Complete" to mark items as done
5. **Delete Items**: Click "Delete" button (with confirmation)
6. **Filter & Sort**: Use the filter and sort dropdowns to organize items

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

## Data Storage

Currently, the application uses JSON file storage (`backend/data/bmpl-items.json`). This is perfect for development and can easily be upgraded to a database like:
- MongoDB
- PostgreSQL
- MySQL
- SQLite

The service layer architecture makes this transition seamless.

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **ts-node-dev** - Development server with hot reload
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Modern styling with gradients and animations
- **Fetch API** - HTTP client

## Development Tips

1. **Hot Reloading**: Both servers support hot reloading. Changes automatically reflect in the browser.
2. **Type Safety**: Take advantage of TypeScript's type checking for better code quality.
3. **API Testing**: Use tools like Postman or curl to test API endpoints directly.
4. **Browser DevTools**: Use React DevTools and Network tab for debugging.

## Next Steps & Enhancements

- [ ] Add database integration (MongoDB, PostgreSQL, etc.)
- [ ] Add user authentication (JWT, OAuth, etc.)
- [ ] Add pagination for large item lists
- [ ] Add search functionality
- [ ] Add drag-and-drop reordering
- [ ] Add dark mode toggle
- [ ] Add export/import functionality
- [ ] Add item categories/tags
- [ ] Add due dates and reminders
- [ ] Add state management (Redux, Zustand, etc.)
- [ ] Add unit and integration tests
- [ ] Add CI/CD pipeline

## Troubleshooting

- **Port already in use**: Change the PORT in backend `.env` file
- **CORS errors**: Ensure backend is running and CORS is properly configured
- **Type errors**: Run `npm run type-check` in backend
- **Data not persisting**: Check that `backend/data/` directory exists and is writable
- **Frontend can't connect to backend**: Verify backend is running on port 5000

## License

ISC

---

Built with ❤️ using React, TypeScript, and Node.js
