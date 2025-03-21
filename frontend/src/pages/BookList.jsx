import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

// Import komponen
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import BookTable from "../components/BookTable";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/books");
      console.log("Data buku:", response.data.data);
      setBooks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Gagal memuat data buku");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, location.key]);

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      return;
    }

    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Gagal menghapus buku");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-[80rem] mx-auto px-4 py-8">
        <ErrorAlert message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Daftar Buku</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchBooks}
            className="px-3 py-1 bg-[#10b981] text-white rounded hover:bg-[#059669] flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
          {isAuthenticated && (
            <Link to="/books/new" className="btn btn-primary">
              Tambah Buku
            </Link>
          )}
        </div>
      </div>

      <BookTable
        books={books}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default BookList;
