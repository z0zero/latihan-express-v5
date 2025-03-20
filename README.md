# Book API - Express.js v5 with MySQL

A simple REST API for managing books using Express.js v5 and MySQL database.

## Requirements

- Node.js (v18+ recommended)
- npm or yarn
- MySQL Server

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd book-api

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory based on the `.env.example` and configure your MySQL database settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=book_api
```

## Usage

```bash
# Run in development mode
npm run dev

# Run in production mode
npm start
```

The API will be available at `http://localhost:3000/api`

## Database Setup

The application will automatically:

1. Create the database if it doesn't exist
2. Create the required tables
3. Seed the database with initial data

## API Endpoints

### Books

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| GET    | /api/books     | Get all books     |
| GET    | /api/books/:id | Get a book by ID  |
| POST   | /api/books     | Create a new book |
| PUT    | /api/books/:id | Update a book     |
| DELETE | /api/books/:id | Delete a book     |

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

## Request Examples

### Create a Book

**Request:**

```http
POST /api/books
Content-Type: application/json

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
book-api/
├── src/
│   ├── config/
│   │   ├── index.js         # Main configuration
│   │   ├── database.js      # Database connection
│   │   ├── database.sql     # SQL schema
│   │   └── initDb.js        # Database initialization
│   ├── controllers/
│   │   └── bookController.js # Book controllers
│   ├── models/
│   │   └── Book.js          # Book model
│   ├── routes/
│   │   ├── index.js         # Routes index
│   │   └── bookRoutes.js    # Book routes
│   └── index.js             # Application entry point
├── .env                     # Environment variables (not in git)
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
├── package.json             # Project metadata and dependencies
└── README.md                # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC
