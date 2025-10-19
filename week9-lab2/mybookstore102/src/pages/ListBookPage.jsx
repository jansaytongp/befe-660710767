import React, { useState, useEffect } from "react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

const ListBookPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

  // ✅ โหลดข้อมูลหนังสือจาก backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/v1/books`);
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลหนังสือได้");
        const data = await response.json();
        setBooks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [apiUrl]);

  // 🟡 ลบหนังสือ
  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือเล่มนี้?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/v1/books/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("ไม่สามารถลบหนังสือได้");
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  // 🟢 แก้ไขหนังสือ (ไปยังหน้าแก้ไข)
  const handleEdit = (id) => {
    window.location.href = `/edit-book/${id}`;
  };

  // 🌀 Spinner โหลด
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-viridian-600 rounded-full animate-spin"></div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <p className="text-center text-red-600 mt-10">เกิดข้อผิดพลาด: {error}</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          รายชื่อหนังสือทั้งหมด
        </h1>

        {books.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border text-left">#</th>
                  <th className="px-4 py-3 border text-left">ชื่อหนังสือ</th>
                  <th className="px-4 py-3 border text-left">ผู้เขียน</th>
                  <th className="px-4 py-3 border text-left">หมวดหมู่</th>
                  <th className="px-4 py-3 border text-right">ราคา (บาท)</th>
                  <th className="px-4 py-3 border text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr
                    key={book.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{book.title}</td>
                    <td className="px-4 py-2 border">{book.author}</td>
                    <td className="px-4 py-2 border">
                      {book.category || "—"}
                    </td>
                    <td className="px-4 py-2 border text-right">
                      {book.price ? `${book.price.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(book.id)}
                          className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                        >
                          <PencilAltIcon className="w-4 h-4 mr-1" />
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">ไม่มีข้อมูลหนังสือ</p>
        )}
      </div>
    </div>
  );
};

export default ListBookPage;
