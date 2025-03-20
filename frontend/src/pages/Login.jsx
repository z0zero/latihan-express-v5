import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        navigate("/books");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-[#f9fafb] py-12 px-4">
      <div className="card max-w-[28rem] w-full my-8">
        <div>
          <h1 className="text-center text-[1.875rem] font-extrabold text-[#111827]">
            Login
          </h1>
          <p className="mt-2 text-center text-sm text-[#6b7280]">
            Atau{" "}
            <Link
              to="/register"
              className="font-medium text-[#2563eb] hover:text-[#1d4ed8]"
            >
              buat akun baru
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-[#fee2e2] border border-[#f87171] text-[#b91c1c] p-3 rounded mt-4">
            {error}
          </div>
        )}

        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="mb-4">
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
            <div className="mb-4">
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
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex justify-center"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
