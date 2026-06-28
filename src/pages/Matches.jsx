import React, { useEffect, useState } from "react";
import API from "../config/api";
import Swal from "sweetalert2";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await API.get("/matches");
      setMatches(res.data.matches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  const handleGenerate = async () => {
    try {
      setProcessing(true);
      await API.post("/matches/generate");
      await fetchMatches();
      Swal.fire({ icon: "success", title: "Match dibuat!", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal generate", text: err.response?.data?.message || "Terjadi kesalahan" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Hapus semua match?",
      text: "Tindakan ini tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    try {
      setProcessing(true);
      await API.delete("/matches");
      setMatches([]);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal hapus" });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-7 h-7 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Matches</h2>
          <p className="text-sm text-gray-400 mt-0.5">{matches.length} pasangan ditemukan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Generate match
          </button>
          <button
            onClick={handleDelete}
            disabled={processing || matches.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-500 text-sm font-semibold rounded-xl transition disabled:opacity-40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus semua
          </button>
        </div>
      </div>

      {/* Empty state */}
      {matches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Belum ada match</p>
          <p className="text-sm text-gray-400 mt-1">Klik "Generate match" untuk membuat pasangan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matches.map((m, i) => (
            <div key={m.matchId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
              <p className="text-xs text-gray-400 font-medium mb-3">Match #{i + 1}</p>
              <div className="flex items-center gap-3">
                {/* Person 1 */}
                <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs mx-auto mb-1.5 flex items-center justify-center">
                    {m.participant1.fullName?.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{m.participant1.fullName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.participant1.number}M</p>
                </div>

                {/* Heart */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                    </svg>
                  </div>
                </div>

                {/* Person 2 */}
                <div className="flex-1 bg-pink-50 rounded-xl p-3 text-center">
                  <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 font-semibold text-xs mx-auto mb-1.5 flex items-center justify-center">
                    {m.participant2.fullName?.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{m.participant2.fullName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.participant2.number}W</p>
                </div>
              </div>
              <p className="text-xs text-center text-gray-300 mt-3">
                {new Date(m.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
