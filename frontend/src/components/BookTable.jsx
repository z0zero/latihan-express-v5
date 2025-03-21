import React from "react";
import { Link } from "react-router-dom";
import BookCover from "./BookCover";

const BookTable = ({ books, isAuthenticated, isAdmin, onDelete }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-[#6b7280]">
          Belum ada buku. Silakan tambahkan buku baru.
        </p>
      </div>
    );
  }

  return (
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
                <BookCover coverUrl={book.cover_url} title={book.title} />
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
                <div className="text-sm text-[#6b7280]">{book.year || "-"}</div>
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
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(book.id)}
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
  );
};

export default BookTable;
