import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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

    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword from data sent to API
      const { confirmPassword: _confirmPassword, ...registerData } = formData;

      const result = await register(registerData);

      if (result.success) {
        navigate("/books");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Terjadi kesalahan saat registrasi.");
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-[#f9fafb] py-12 px-4">
      <div className="card max-w-[28rem] w-full my-8">
        <div>
          <h1 className="text-center text-[1.875rem] font-extrabold text-[#111827]">
            Buat Akun
          </h1>
          <p className="mt-2 text-center text-sm text-[#6b7280]">
            Atau{" "}
            <Link
              to="/login"
              className="font-medium text-[#2563eb] hover:text-[#1d4ed8]"
            >
              login ke akun yang sudah ada
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-[#fee2e2] border border-[#f87171] text-[#b91c1c] p-3 rounded mt-4">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Nama
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-input"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="form-input"
                placeholder="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex justify-center"
            >
              {loading ? "Memproses..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
