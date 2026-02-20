# 🏦 KodbBank - Full-Stack Banking Application

A modern full-stack banking application built with Node.js, Express.js, MySQL, and React.js.

## 📋 Features

- **User Registration**: Create new customer accounts with default balance of ₹100,000
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- **Balance Check**: View account balance with beautiful animations
- **Modern UI**: Clean, responsive design with smooth animations
- **Session Management**: Cookie-based session handling

## 🏗️ Project Structure

```
netbanking/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── userController.js  # User operations
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── userRoutes.js      # User endpoints
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   └── initDatabase.js    # Database initialization
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   └── package.json           # Backend dependencies
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Confetti.jsx   # Confetti animation
    │   ├── pages/
    │   │   ├── Register.jsx   # Registration page
    │   │   ├── Login.jsx      # Login page
    │   │   └── Dashboard.jsx  # Dashboard page
    │   ├── utils/
    │   │   └── api.js         # API utilities
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # React entry point
    └── package.json           # Frontend dependencies
```

## 🗄️ Database Schema

### KodUser Table
- `uid` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR(50), UNIQUE, NOT NULL)
- `email` (VARCHAR(100), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NOT NULL) - Hashed with bcrypt
- `balance` (DECIMAL(15,2), DEFAULT 100000.00)
- `phone` (VARCHAR(20))
- `role` (ENUM: 'customer', 'manager', 'admin', DEFAULT 'customer')
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### UserToken Table
- `tid` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `token` (VARCHAR(500), NOT NULL)
- `uid` (INT, FOREIGN KEY → KodUser.uid)
- `expiry` (DATETIME, NOT NULL)
- `createdAt` (TIMESTAMP)

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database (Aiven or local)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   ```bash
   copy .env.example .env
   ```
   - Edit `.env` and add your Aiven MySQL credentials:
   ```env
   DB_HOST=your-aiven-host.aivencloud.com
   DB_PORT=your-port
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=defaultdb
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Initialize database tables:**
   ```bash
   node models/initDatabase.js
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   - Copy `.env.example` to `.env`
   ```bash
   copy .env.example .env
   ```
   - Edit `.env` if your backend runs on a different port:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

- **POST /api/auth/register**
  - Register a new user
  - Body: `{ username, email, password, phone }`
  - Response: `{ success: true, message: "Registration successful..." }`

- **POST /api/auth/login**
  - Login user
  - Body: `{ username, password }`
  - Sets HTTP-only cookie with JWT token
  - Response: `{ success: true, message: "Login successful", user: {...} }`

- **POST /api/auth/logout**
  - Logout user
  - Clears token cookie
  - Response: `{ success: true, message: "Logout successful" }`

### User Routes (`/api/user`) - Protected

- **GET /api/user/balance**
  - Get user balance (requires authentication)
  - Response: `{ success: true, message: "Your balance is", balance: 100000 }`

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds of 10
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Token Expiry**: Tokens expire after 24 hours
- **Database Token Storage**: Tokens are stored and validated in database
- **CORS Protection**: Configured for specific frontend origin

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, gradient-based design
- **Animations**: Smooth transitions and confetti effect on balance load
- **Error Handling**: User-friendly error messages
- **Session Management**: Automatic cookie handling

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MySQL2 (Aiven MySQL)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- cookie-parser (Cookie handling)
- dotenv (Environment variables)
- cors (Cross-origin resource sharing)

### Frontend
- React.js
- React Router DOM (Routing)
- Axios (HTTP client)
- Vite (Build tool)

## 📝 Development Notes

- The application uses MVC architecture for backend
- All passwords are hashed before storage
- JWT tokens include username, role, and user ID
- Tokens are stored in database for validation
- Frontend automatically sends cookies with requests
- Balance is displayed in Indian Rupee format (₹)

## 🐛 Troubleshooting

1. **Database Connection Error:**
   - Verify your Aiven MySQL credentials in `.env`
   - Ensure your IP is whitelisted in Aiven console
   - Check if database tables are initialized

2. **CORS Errors:**
   - Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
   - Check that `withCredentials: true` is set in axios config

3. **Token Errors:**
   - Clear browser cookies and try logging in again
   - Check if JWT_SECRET is set in backend `.env`
   - Verify token expiry hasn't passed

4. **Port Already in Use:**
   - Change `PORT` in backend `.env` file
   - Update `VITE_API_URL` in frontend `.env` accordingly

## 📄 License

ISC

## 👤 Author

Created for KodbBank application

---

**Happy Banking! 🎉**
