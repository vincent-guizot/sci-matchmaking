import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../config/api";

const ParticipantsLiked = () => {
  const [likesData, setLikesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/likes");
      setLikesData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLike = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Hapus pilihan?",
      text: `Hapus semua pilihan dari ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    try {
      await API.delete(`/likes/${id}`);
      Swal.fire({
        icon: "success",
        title: "Dihapus",
        timer: 1200,
        showConfirmButton: false,
      });
      fetchLikes();
    } catch {
      Swal.fire("Error", "Gagal menghapus", "error");
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-7 h-7 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Participants yang sudah memilih
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {likesData.length} peserta telah menentukan pilihan
        </p>
      </div>

      {likesData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-gray-400">Belum ada peserta yang memilih.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Peserta
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Pilihan
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-24">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {likesData.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-50 transition align-top"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                            row.gender === "M"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {row.fullName
                            ?.split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {row.number}
                            {row.gender === "M" ? "M" : "W"} — {row.fullName}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.gender === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}
                          >
                            {row.gender === "M" ? "Pria" : "Wanita"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {row.likes.length === 0 ? (
                        <span className="text-gray-300 text-xs">
                          Belum memilih
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {row.likes.map((p) => (
                            <span
                              key={p._id}
                              className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 text-xs px-2.5 py-1 rounded-full font-medium"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-2.5 h-2.5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                              </svg>
                              {p.number} — {p.fullName}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => deleteLike(row._id, row.fullName)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsLiked;
