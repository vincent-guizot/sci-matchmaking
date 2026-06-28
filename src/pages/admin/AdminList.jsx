import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../config/api";

const RELIGION_BADGE = {
  kristen: "bg-blue-100 text-blue-700",
  katolik: "bg-pink-100 text-pink-700",
  buddha: "bg-green-100 text-green-700",
  konghucu: "bg-amber-100 text-amber-700",
};

const AdminList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGender, setFilterGender] = useState("M");
  const [search, setSearch] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/participants");
      setMembers(data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (m) => {
    const confirm = await Swal.fire({
      title: "Hapus peserta?",
      text: `${m.fullName} (${m.gender === "M" ? "Pria" : "Wanita"} #${m.number})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    try {
      await API.delete(`/participants/${m._id}`);
      Swal.fire({
        title: "Dihapus",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      fetchMembers();
    } catch {
      Swal.fire("Error", "Gagal menghapus", "error");
    }
  };

  const filtered = members
    .filter((m) => m.gender === filterGender)
    .filter((m) =>
      search ? m.fullName?.toLowerCase().includes(search.toLowerCase()) : true,
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Daftar peserta (Admin)
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length} peserta
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
          />
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {[
            { v: "M", l: "Pria" },
            { v: "F", l: "Wanita" },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setFilterGender(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filterGender === v ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Nama
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    No.
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Agama
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Thn Lahir
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Alamat
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-24">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${m.gender === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}
                        >
                          {m.fullName
                            ?.split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")}
                        </div>
                        <span className="font-medium text-gray-800">
                          {m.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                      {m.number}
                    </td>
                    <td className="px-5 py-3">
                      {m.religion ? (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${RELIGION_BADGE[m.religion] || "bg-gray-100 text-gray-600"}`}
                        >
                          {m.religion}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500">{m.age || "—"}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-[160px] truncate">
                      {m.address || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(m)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
