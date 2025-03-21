import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

// Import komponen
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import AlertModal from "../components/AlertModal";
import ImagePreview from "../components/ImagePreview";

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
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-8 relative">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#111827] mb-6">
          {isEditMode ? "Edit Buku" : "Tambah Buku Baru"}
        </h1>

        <ErrorAlert message={error} />

        {/* Modal untuk pesan error */}
        <AlertModal
          show={showModal}
          onClose={() => setShowModal(false)}
          message={modalMessage}
        />

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

              <ImagePreview
                imageUrl={previewUrl}
                onRemove={handleRemoveImage}
              />

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
