import React, { useState } from "react";
import useMembers from "../hooks/useMember";

const RELIGION_BADGE = {
  kristen: "bg-blue-100 text-blue-700",
  katolik: "bg-pink-100 text-pink-700",
  buddha: "bg-green-100 text-green-700",
  konghucu: "bg-amber-100 text-amber-700",
};

const Members = () => {
  const { members, loading } = useMembers();
  const [filterGender, setFilterGender] = useState("");
  const [filterReligion, setFilterReligion] = useState("");
  const [search, setSearch] = useState("");

  const filtered = members.filter((m) => {
    const gMatch = filterGender ? m.gender === filterGender : true;
    const rMatch = filterReligion ? String(m.religion) === filterReligion : true;
    const sMatch = search
      ? m.fullName?.toLowerCase().includes(search.toLowerCase())
      : true;
    return gMatch && rMatch && sMatch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Members list</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length} peserta ditemukan
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
          />
        </div>

        {/* Gender filter */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {[{ v: "", l: "Semua" }, { v: "M", l: "Pria" }, { v: "F", l: "Wanita" }].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setFilterGender(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filterGender === v
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Religion filter */}
        <select
          value={filterReligion}
          onChange={(e) => setFilterReligion(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
        >
          <option value="">Semua agama</option>
          <option value="kristen">Kristen</option>
          <option value="katolik">Katolik</option>
          <option value="buddha">Buddha</option>
          <option value="konghucu">Konghucu</option>
        </select>
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
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-16">No.</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nama</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Agama</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Gender</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Thn Lahir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50 transition group">
                    <td className="px-5 py-3 text-gray-400 font-mono text-xs">{m.number}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                            m.gender === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {m.fullName?.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                        </div>
                        <span className="font-medium text-gray-800">{m.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {m.religion ? (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${RELIGION_BADGE[m.religion] || "bg-gray-100 text-gray-600"}`}>
                          {m.religion}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m.gender === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                        {m.gender === "M" ? "Pria" : "Wanita"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{m.age || "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      Tidak ada data yang cocok
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

export default Members;
