import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white min-h-[100vh]">
      <div className="max-w-[80rem] mx-auto py-16 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl md:text-6xl">
            <span className="block">Selamat Datang di</span>
            <span className="block text-[#2563eb]">Book API</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-[#6b7280] sm:text-lg md:mt-5 md:text-xl md:max-w-[48rem]">
            Aplikasi manajemen buku sederhana menggunakan Express.js v5, React,
            dan MySQL.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/books"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#2563eb] hover:bg-[#1d4ed8] md:py-4 md:text-lg md:px-10"
              >
                Lihat Daftar Buku
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              {isAuthenticated ? (
                <Link
                  to="/books/new"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#2563eb] bg-white hover:bg-[#f9fafb] md:py-4 md:text-lg md:px-10"
                >
                  Tambah Buku Baru
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#2563eb] bg-white hover:bg-[#f9fafb] md:py-4 md:text-lg md:px-10"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f9fafb] py-16">
        <div className="max-w-[80rem] mx-auto px-4">
          <div className="max-w-[56rem] mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              Fitur Aplikasi
            </h2>
            <p className="mt-3 text-xl text-[#6b7280] sm:mt-4">
              Aplikasi ini dibuat sebagai contoh implementasi REST API CRUD
              dengan Express.js v5, MySQL, dan React.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-[#111827]">
                Autentikasi JWT
              </h3>
              <p className="mt-2 text-base text-[#6b7280]">
                Sistem autentikasi menggunakan JSON Web Token dengan fitur login
                dan registrasi.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-[#111827]">
                Manajemen Buku
              </h3>
              <p className="mt-2 text-base text-[#6b7280]">
                CRUD (Create, Read, Update, Delete) operasi untuk mengelola data
                buku.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-[#111827]">
                Role-Based Access
              </h3>
              <p className="mt-2 text-base text-[#6b7280]">
                Pembatasan akses berdasarkan peran (user dan admin) untuk fitur
                tertentu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
