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
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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

            if (book.cover_url) {
              setPreviewUrl(`http://localhost:3000${book.cover_url}`);
            }
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

  const showErrorModal = (message) => {
    setModalMessage(message);
    setShowModal(true);

    // Otomatis hilangkan modal setelah 3 detik
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match("image/jpeg|image/png")) {
        showErrorModal("Hanya file JPG dan PNG yang diperbolehkan");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showErrorModal("Ukuran file melebihi batas maksimal 2MB");
        return;
      }

      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setPreviewUrl("");
    // Reset file input
    const fileInput = document.getElementById("cover_image");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Create FormData object to handle file upload
      const formDataObj = new FormData();

      // Add text fields to FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataObj.append(key, formData[key]);
        }
      });

      // Add file if it exists
      if (coverImage) {
        formDataObj.append("cover_image", coverImage);
      }

      let response;

      // Adjusted API calls to use FormData
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        response = await api.put(`/books/${id}`, formDataObj, config);
      } else {
        response = await api.post("/books", formDataObj, config);
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
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-8 relative">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#111827] mb-6">
          {isEditMode ? "Edit Buku" : "Tambah Buku Baru"}
        </h1>

        {error && (
          <div className="bg-[#fee2e2] border border-[#f87171] text-[#b91c1c] p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Modal untuk pesan error */}
        {showModal && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg p-8 max-w-2xl w-full shadow-xl border-2 border-[#f87171]">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-[#fee2e2] rounded-full p-3 mr-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#ef4444]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-[#111827]">
                  Peringatan
                </h3>
                <div className="mt-2 text-base text-[#6b7280]">
                  {modalMessage}
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#3b82f6] text-white text-base rounded hover:bg-[#2563eb]"
                    onClick={() => setShowModal(false)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="card"
          encType="multipart/form-data"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="form-label">
                Judul <span className="text-[#ef4444]">*</span>
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
                Penulis <span className="text-[#ef4444]">*</span>
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

            <div>
              <label htmlFor="cover_image" className="form-label">
                Cover Buku
              </label>
              <div className="mt-1 flex items-center">
                <input
                  id="cover_image"
                  name="cover_image"
                  type="file"
                  accept="image/jpeg,image/png"
                  className="block w-full text-sm text-[#6b7280] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#3b82f6] file:text-white hover:file:bg-[#2563eb]"
                  onChange={handleFileChange}
                />
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm text-[#6b7280] mb-2">Preview:</p>
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="Cover preview"
                      className="h-40 object-cover rounded border border-[#e5e7eb]"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-[#ef4444] text-white rounded-full p-1"
                      title="Hapus gambar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-2 text-sm text-[#6b7280]">
                Format yang didukung: JPG, PNG. Maksimal 2MB.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-[#d1d5db] rounded-md shadow-sm text-sm font-medium text-[#374151] hover:bg-[#f9fafb] focus:outline-none"
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
