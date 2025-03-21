import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

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
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[80rem] mx-auto px-4 py-8">
        <div className="bg-[#fee2e2] border border-[#f87171] text-[#b91c1c] p-3 rounded">
          {error}
        </div>
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

      {books.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[#6b7280]">
            Belum ada buku. Silakan tambahkan buku baru.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-[#e5e7eb]">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Penulis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Tahun
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Genre
                </th>
                {isAuthenticated && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.cover_url ? (
                      <img
                        src={`http://localhost:3000${book.cover_url}`}
                        alt={`Cover ${book.title}`}
                        className="h-20 w-16 object-cover rounded shadow"
                        onError={(e) => {
                          console.error("Error loading image:", e);
                          e.target.onerror = null;
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="h-20 w-16 bg-[#e5e7eb] rounded flex items-center justify-center text-[#9ca3af]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#111827]">
                      {book.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6b7280]">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6b7280]">
                      {book.year || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6b7280]">
                      {book.genre || "-"}
                    </div>
                  </td>
                  {isAuthenticated && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/books/${book.id}/edit`}
                        className="btn btn-primary mr-4"
                      >
                        Edit
                      </Link>
                      {isAdmin() && (
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="btn btn-danger"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookList;
