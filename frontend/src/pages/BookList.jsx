import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        setBooks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Gagal memuat data buku");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb]"></div>
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
        {isAuthenticated && (
          <Link to="/books/new" className="btn btn-primary">
            Tambah Buku
          </Link>
        )}
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
