import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Selamat Datang di</span>
            <span className="block text-blue-600">Book API</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Aplikasi manajemen buku sederhana menggunakan Express.js v5, React,
            dan MySQL.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/books"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Lihat Daftar Buku
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              {isAuthenticated ? (
                <Link
                  to="/books/new"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Tambah Buku Baru
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Fitur Aplikasi
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Aplikasi ini dibuat sebagai contoh implementasi REST API CRUD
              dengan Express.js v5, MySQL, dan React.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Autentikasi JWT
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Sistem autentikasi menggunakan JSON Web Token dengan fitur login
                dan registrasi.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Manajemen Buku
              </h3>
              <p className="mt-2 text-base text-gray-500">
                CRUD (Create, Read, Update, Delete) operasi untuk mengelola data
                buku.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Role-Based Access
              </h3>
              <p className="mt-2 text-base text-gray-500">
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
