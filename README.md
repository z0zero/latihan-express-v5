# Book API - Express.js v5 with MySQL

A simple REST API for managing books using Express.js v5 and MySQL database with JWT authentication.

## Requirements

- Node.js (v18+ recommended)
- npm or yarn
- MySQL Server

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd book-api

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Configuration

Create a `.env` file in the root directory based on the `.env.example` and configure your settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=book_api

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d
```

## Usage

```bash
# Run backend in development mode
npm run dev

# Run frontend in development mode
cd frontend
npm run dev

# Run backend in production mode
npm start
```

The API will be available at `http://localhost:3000/api`
The frontend will be available at `http://localhost:5173`

## Database Setup

The application will automatically:

1. Create the database if it doesn't exist
2. Create the required tables
3. Seed the database with initial data
4. Create a default admin user (email: admin@example.com, password: admin123)

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. To access protected routes, you need to:

1. Register a new user or login with existing credentials
2. Include the JWT token in the Authorization header of your requests

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Auth Endpoints

| Method | Endpoint           | Description              | Access    |
| ------ | ------------------ | ------------------------ | --------- |
| POST   | /api/auth/register | Register a new user      | Public    |
| POST   | /api/auth/login    | Login a user             | Public    |
| GET    | /api/auth/profile  | Get current user profile | Protected |

## API Endpoints

### Books

| Method | Endpoint       | Description       | Access     |
| ------ | -------------- | ----------------- | ---------- |
| GET    | /api/books     | Get all books     | Public     |
| GET    | /api/books/:id | Get a book by ID  | Public     |
| POST   | /api/books     | Create a new book | Protected  |
| PUT    | /api/books/:id | Update a book     | Protected  |
| DELETE | /api/books/:id | Delete a book     | Admin Only |

### Book Object Structure

```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "year": 1925,
  "genre": "Novel"
}
```

## Role-Based Access Control

The API implements role-based access control with two roles:

- **User**: Can create and update books
- **Admin**: Can do everything including deleting books

## Data Validation

The API implements validation using Express Validator for the following:

### Auth Validation

#### Register Validation

- `name`: Required, string, 3-100 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters, at least 1 letter and 1 number

#### Login Validation

- `email`: Required, valid email format
- `password`: Required

### Book Validation

#### Create Book Validation

- `title`: Required, string, 2-255 characters
- `author`: Required, string, 2-255 characters
- `year`: Optional, integer between 1000 and current year
- `genre`: Optional, string, 2-100 characters

#### Update Book Validation

- `id`: Required, positive integer
- `title`: Optional, string, 2-255 characters
- `author`: Optional, string, 2-255 characters
- `year`: Optional, integer between 1000 and current year
- `genre`: Optional, string, 2-100 characters

### Error Response Format

When validation fails, the API responds with a 400 Bad Request status and a JSON object:

```json
{
  "success": false,
  "errors": [
    {
      "field": "title",
      "message": "Judul buku wajib diisi"
    },
    {
      "field": "author",
      "message": "Penulis buku wajib diisi"
    }
  ]
}
```

## Request Examples

### Register a New User

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create a Book (Authenticated)

**Request:**

```http
POST /api/books
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "year": 1937,
  "genre": "Fantasy"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "year": 1937,
    "genre": "Fantasy"
  }
}
```

## Project Structure

```
express-js/crud/
├── backend/                # Backend directory
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js    # Main configuration
│   │   │   ├── database.js # Database connection
│   │   │   ├── database.sql # SQL schema
│   │   │   └── initDb.js   # Database initialization
│   │   ├── controllers/
│   │   │   ├── authController.js # Auth controllers
│   │   │   └── bookController.js # Book controllers
│   │   ├── middleware/
│   │   │   └── auth.js     # Authentication middleware
│   │   ├── models/
│   │   │   ├── Book.js     # Book model
│   │   │   └── User.js     # User model
│   │   ├── routes/
│   │   │   ├── index.js    # Routes index
│   │   │   ├── authRoutes.js # Auth routes
│   │   │   └── bookRoutes.js # Book routes
│   │   ├── validators/
│   │   │   ├── index.js    # Global validation utilities
│   │   │   ├── authValidator.js # Auth validation rules
│   │   │   └── bookValidator.js # Book validation rules
│   │   └── index.js        # Application entry point
│   ├── .env                # Environment variables (not in git)
│   ├── .env.example        # Example environment variables
│   ├── package.json        # Backend dependencies and scripts
│   └── README.md           # Backend documentation
│
├── frontend/              # Frontend directory
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx # Navigation bar component
│   │   │   └── ProtectedRoute.jsx # Authentication route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx   # Home page
│   │   │   ├── Login.jsx  # Login page
│   │   │   ├── Register.jsx # Registration page
│   │   │   ├── BookList.jsx # Book listing page
│   │   │   └── BookForm.jsx # Book creation/edit form
│   │   ├── utils/
│   │   │   └── api.js     # API configuration with Axios
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles with Tailwind imports
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── package.json       # Frontend dependencies and scripts
│
├── .gitignore            # Git ignore file
├── package.json          # Project metadata and dependencies
└── README.md             # This file
```

## Technologies Used

### Backend

- Express.js v5
- MySQL
- JWT Authentication
- Express Validator

### Frontend

- React 19
- React Router DOM 7
- Tailwind CSS 4
- Axios
- JWT Decode
- Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC
