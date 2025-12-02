# 🌌 Codeforces – Local Business Discovery Platform

Welcome to **Codeforces**, a full-stack web application built for **CSC443 – Project 2**.  
This platform allows users to **discover, review, and explore** local businesses with a beautifully designed, Aurora-themed interface backed by a robust Node.js/Express API.

---

## 🚀 Overview

**Codeforces** enables users to:

- Browse and search for local businesses by name, category, or rating
- Read and submit reviews for businesses with full CRUD operations
- Add, edit, and delete businesses (owner-only permissions)
- Register and login with secure JWT authentication
- Filter and sort businesses dynamically with pagination support
- Enjoy an elegant **Aurora gradient design** with dark/light theme toggle
- Experience seamless full-stack integration with real-time data persistence

---

## 🧠 Tech Stack

| Layer                  | Technology                    |
| :--------------------- | :---------------------------- |
| **Frontend Framework** | React (Vite)                  |
| **Styling**            | Tailwind CSS                  |
| **Animations**         | Framer Motion                 |
| **Icons**              | Lucide React                  |
| **Routing**            | React Router                  |
| **State Management**   | Context API                   |
| **Backend Framework**  | Node.js, Express.js           |
| **Database**           | MongoDB (Mongoose ODM)        |
| **Authentication**     | JWT (jsonwebtoken), bcrypt    |
| **API Testing**        | Morgan (logging)              |
| **Deployment**         | Vercel (Frontend), Render (Backend) |
| **Build Tool**         | Vite                          |

---

## 🌐 Deployment Links

- **Live Frontend**: https://local-reviews.vercel.app/
- **Live Backend API**: https://local-reviews-backend.onrender.com
- **GitHub Repository**: https://github.com/chebli2002/local-reviews.git

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- npm or pnpm package manager

### Backend Setup

1️⃣ **Navigate to backend directory**
```bash
cd backend
```

2️⃣ **Install dependencies**
```bash
npm install
# or
pnpm install
```

3️⃣ **Configure environment variables**

Create a `.env` file in the `backend` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4️⃣ **Start the backend server**
```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1️⃣ **Navigate to frontend directory**
```bash
cd frontend
```

2️⃣ **Install dependencies**
```bash
npm install
# or
pnpm install
```

3️⃣ **Configure environment variables**

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

4️⃣ **Run the development server**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📡 API Documentation

### Base URL
- **Local**: `http://localhost:5000/api`
- **Production**: `https://local-reviews-backend.onrender.com/api`

### Authentication Endpoints

#### Register User
- **POST** `/auth/register`
- **Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string (min 8 chars, uppercase, number, special char)"
}
```
- **Response**: `{ token, user: { id, username, email } }`

#### Login User
- **POST** `/auth/login`
- **Body**:
```json
{
  "email": "string (or username)",
  "password": "string"
}
```
- **Response**: `{ token, user: { id, username, email } }`

### Business Endpoints

#### Get All Businesses (Public)
- **GET** `/businesses?page=1&limit=10`
- **Response**: 
```json
{
  "businesses": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Business by ID (Public)
- **GET** `/businesses/:id`
- **Response**: Business object with reviews populated

#### Create Business (Protected)
- **POST** `/businesses`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "string",
  "description": "string",
  "address": "string",
  "phone": "string",
  "website": "string",
  "category_id": "string",
  "google_map_url": "string",
  "photos": ["string"]
}
```

#### Update Business (Protected - Owner Only)
- **PUT** `/businesses/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Same as create (partial updates allowed)

#### Delete Business (Protected - Owner Only)
- **DELETE** `/businesses/:id`
- **Headers**: `Authorization: Bearer <token>`

### Review Endpoints

#### Get Reviews for Business (Public)
- **GET** `/reviews/business/:businessId`

#### Get Reviews by User (Public)
- **GET** `/reviews/user/:userId`

#### Create Review (Protected)
- **POST** `/reviews`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "business_id": "string",
  "rating": 1-5,
  "comment": "string"
}
```

#### Update Review (Protected - Author Only)
- **PUT** `/reviews/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "rating": 1-5,
  "comment": "string"
}
```

#### Delete Review (Protected - Author Only)
- **DELETE** `/reviews/:id`
- **Headers**: `Authorization: Bearer <token>`

---

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (required, 3-32 chars),
  email: String (required, unique, lowercase),
  passwordHash: String (required, bcrypt hashed),
  timestamps: true
}
```

### Business Model
```javascript
{
  name: String (required),
  description: String (required),
  address: String (required),
  phone: String,
  website: String,
  category_id: String (required),
  owner_id: ObjectId (ref: User, required),
  google_map_url: String,
  photos: [String],
  timestamps: true
}
```

### Review Model
```javascript
{
  business: ObjectId (ref: Business, required),
  user: ObjectId (ref: User, required),
  rating: Number (required, 1-5),
  comment: String (required, max 1000 chars),
  timestamps: true
}
```

---

## ✨ Key Features

### Phase 1 Features
✅ Dynamic Aurora Background with theme transitions  
✅ Dark/Light Mode with persistent storage  
✅ Owner-Only Business Editing logic  
✅ Public Reviews visible to all users  
✅ Fully Responsive design (mobile/tablet/desktop)  
✅ Futuristic Animations with Framer Motion  

### Phase 2 Features (New)
✅ **RESTful API** with Express.js and Node.js  
✅ **MongoDB Database** with Mongoose ODM  
✅ **JWT Authentication** with secure token-based auth  
✅ **Password Hashing** using bcrypt with salt  
✅ **Protected Routes** with authentication middleware  
✅ **Authorization Logic** (owner-only edit/delete)  
✅ **Full CRUD Operations** on Users, Businesses, and Reviews  
✅ **Pagination Support** for business listings  
✅ **Data Validation** on all API endpoints  
✅ **Error Handling** middleware  
✅ **CORS Configuration** for cross-origin requests  
✅ **Production Deployment** (Frontend: Vercel, Backend: Render)

---

## 🧑‍💻 Team Codeforces

| Member  | Phase 1 Contribution | Phase 2 Contribution |
| :------ | :------------------- | :------------------- |
| **Chebli**  | Designed homepage (Aurora animation, hero transitions), implemented dark/light mode logic, and aesthetic components | Backend API architecture, MongoDB schema design, authentication middleware, and deployment configuration |
| **Nabil**   | Developed authentication pages (Login & Register), and implemented ownership logic for businesses | User authentication controllers (register/login), password hashing with bcrypt, JWT token generation |
| **John**    | Built BusinessList and BusinessDetail components, integrated reviews, and optimized responsive design | Business CRUD controllers, pagination implementation, review system backend logic |
| **Charbel** | Connected all routes, handled Context API state, footer logic, and final debugging & deployment setup | Review CRUD controllers, API route configuration, CORS setup, frontend-backend integration |

---

## 🧮 Functionality Summary

### Frontend
- **Home Page**: Dynamic hero with Aurora effects and category animations
- **All Businesses**: Displays business cards with filters, sorting, and pagination
- **Business Details**: Shows detailed info, Google Maps integration, and customer reviews
- **Add/Edit Business**: Allows authenticated users to manage their listings
- **Review System**: Authenticated users can create, edit, and delete reviews
- **Login & Register**: Full authentication with form validation
- **Dark/Light Mode**: Smooth persistent theme switching
- **Responsive Design**: Mobile, tablet, and desktop layouts

### Backend
- **User Registration**: Secure password hashing with unique salt per user
- **User Login**: Credential validation and JWT token issuance
- **Token Verification**: Middleware to protect routes
- **Business Management**: Full CRUD with owner authorization
- **Review Management**: Full CRUD with author authorization
- **Data Validation**: Input validation on all endpoints
- **Error Handling**: Comprehensive error messages
- **Database Queries**: Optimized with population and pagination

---

## 💾 Data Persistence

- **Production**: MongoDB Atlas cloud database
- **Local Development**: MongoDB local instance or Atlas
- All data persists across sessions with automatic timestamps
- Relationships maintained through Mongoose references

---

## 🧾 Technical Challenges & Solutions

### Challenge 1: Password Security
**Problem**: Needed unique salt for each user to prevent rainbow table attacks  
**Solution**: Implemented bcrypt with automatic salt generation (cost factor 10) for each password hash

### Challenge 2: Authorization Logic
**Problem**: Ensuring users can only edit/delete their own content  
**Solution**: Created middleware to verify JWT tokens and compare user IDs before allowing modifications

### Challenge 3: CORS Configuration
**Problem**: Frontend deployed on Vercel couldn't communicate with backend on Render  
**Solution**: Configured dynamic CORS with origin validation for both localhost and production URLs

### Challenge 4: Pagination Performance
**Problem**: Loading all businesses at once was slow with many records  
**Solution**: Implemented server-side pagination with limit/skip and metadata (total pages, hasNext, hasPrev)

---

## 📸 Screenshots

Please check the screenshots in the `/screenshots/` directory:
- `homepage-light.png` - Homepage with light theme
- `homepage-dark.png` - Homepage with dark theme
- `business-list.png` - Business listing with filters
- `review-section.png` - Review system interface
- `api-testing.png` - API endpoint testing

---

## 🏁 Evaluation Checklist

| Requirement                                  | Status |
| -------------------------------------------- | ------ |
| React Functional Components & Hooks          | ✅     |
| Routing with React Router                    | ✅     |
| Context API State Management                 | ✅     |
| Tailwind CSS Styling                         | ✅     |
| Dynamic Filtering & Search                   | ✅     |
| Node.js & Express Backend                    | ✅     |
| MongoDB Database Integration                 | ✅     |
| RESTful API Design                           | ✅     |
| JWT Authentication                           | ✅     |
| Password Hashing (bcrypt)                    | ✅     |
| Protected Routes & Middleware                | ✅     |
| Authorization (Owner/Author Only)            | ✅     |
| Full CRUD Operations                         | ✅     |
| Frontend-Backend Integration                 | ✅     |
| Production Deployment                        | ✅     |
| API Documentation                            | ✅     |
| Code Quality & Comments                      | ✅     |
| Accessibility & Responsiveness               | ✅     |

---

## 📝 Notes for the Instructor

- All logic and design were implemented from scratch by the Codeforces team
- Backend follows RESTful principles with proper HTTP methods and status codes
- Database schema designed for scalability and relationship integrity
- Security best practices implemented (bcrypt, JWT, environment variables)
- The app fulfills all CSC443 Project 2 technical requirements
- Demonstrates modern full-stack development with clean architecture
- Production-ready deployment with professional error handling

---

✨ **Created with pride by Team Codeforces** (Chebli, Nabil, John, Charbel)  
Aurora meets functionality – where beauty, security, and scalability collide.
