import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookList from "./pages/BookList";
import BookForm from "./pages/BookForm";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<BookList />} />

              {/* Protected routes */}
              <Route
                path="/books/new"
                element={
                  <ProtectedRoute>
                    <BookForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/:id/edit"
                element={
                  <ProtectedRoute>
                    <BookForm />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <footer className="bg-white shadow-inner py-4 mt-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Book API - Created with
              Express.js v5, React, and MySQL
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
