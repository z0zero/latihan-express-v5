import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // If in edit mode, fetch book data
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/books/${id}`);

          if (response.data.success) {
            const book = response.data.data;
            setFormData({
              title: book.title || "",
              author: book.author || "",
              year: book.year || "",
              genre: book.genre || "",
            });
          } else {
            setError("Gagal memuat data buku");
          }
        } catch (error) {
          console.error("Error fetching book:", error);
          setError("Gagal memuat data buku");
        } finally {
          setLoading(false);
        }
      };

      fetchBook();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = { ...formData };

      // Convert year to integer if provided
      if (data.year) {
        const yearValue = parseInt(data.year, 10);
        if (!isNaN(yearValue)) {
          data.year = yearValue;
        } else {
          data.year = null; // atau biarkan string jika backend bisa handle
        }
      }

      let response;

      if (isEditMode) {
        response = await api.put(`/books/${id}`, data);
      } else {
        response = await api.post("/books", data);
      }

      if (response.data.success) {
        navigate("/books");
      } else {
        setError("Gagal menyimpan buku");
      }
    } catch (error) {
      console.error("Error saving book:", error);
      setError(error.response?.data?.error || "Gagal menyimpan buku");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? "Edit Buku" : "Tambah Buku Baru"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="form-label">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="form-input"
                placeholder="Judul buku"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="author" className="form-label">
                Penulis <span className="text-red-500">*</span>
              </label>
              <input
                id="author"
                name="author"
                type="text"
                required
                className="form-input"
                placeholder="Nama penulis"
                value={formData.author}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="year" className="form-label">
                Tahun Terbit
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min="1000"
                max={new Date().getFullYear()}
                className="form-input"
                placeholder="Tahun terbit"
                value={formData.year}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="genre" className="form-label">
                Genre
              </label>
              <input
                id="genre"
                name="genre"
                type="text"
                className="form-input"
                placeholder="Genre buku"
                value={formData.genre}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={() => navigate("/books")}
            >
              Batal
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
