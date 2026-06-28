import React, { useState } from "react";
import useMembers from "../hooks/useMember";

const RELIGIONS = [
  {
    id: 1,
    value: "",
    label: "Tidak Sertakan",
  },
  {
    id: 2,
    value: "kristen",
    label: "Kristen",
  },
  {
    id: 3,
    value: "katholik",
    label: "Katholik",
  },
  {
    id: 4,
    value: "buddha",
    label: "Buddha",
  },
  {
    id: 5,
    value: "konghucu",
    label: "Konghucu",
  },
];

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
    const genderMatch = filterGender ? m.gender === filterGender : true;

    let religionMatch = true;

    if (filterReligion === "empty") {
      religionMatch = !m.religion;
    } else if (filterReligion) {
      religionMatch = m.religion === filterReligion;
    }

    const searchMatch = search
      ? m.fullName?.toLowerCase().includes(search.toLowerCase())
      : true;

    return genderMatch && religionMatch && searchMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Members List</h2>

          <p className="text-sm text-gray-400 mt-1">
            {filtered.length} peserta ditemukan
          </p>
        </div>
      </div>

      {/* Filters */}

      <div className="space-y-3">
        <div className="relative">
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-none"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {[
              {
                v: "",
                l: "Semua",
              },
              {
                v: "M",
                l: "Pria",
              },
              {
                v: "F",
                l: "Wanita",
              },
            ].map((item) => (
              <button
                key={item.v}
                onClick={() => setFilterGender(item.v)}
                className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterGender === item.v
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.l}
              </button>
            ))}
          </div>

          <select
            value={filterReligion}
            onChange={(e) => setFilterReligion(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-rose-300 outline-none"
          >
            {RELIGIONS.map((religion) => (
              <option key={religion.id} value={religion.value}>
                {religion.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-rose-200 border-t-rose-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Desktop Table */}

          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wide text-gray-400 w-16">
                      No.
                    </th>

                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Nama
                    </th>

                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Agama
                    </th>

                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Gender
                    </th>

                    <th className="px-5 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Tahun Lahir
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filtered.map((m) => (
                    <tr key={m._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 text-xs font-mono text-gray-400">
                        {m.number}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              m.gender === "M"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-pink-100 text-pink-700"
                            }`}
                          >
                            {m.fullName
                              ?.split(" ")
                              .slice(0, 2)
                              .map((x) => x[0])
                              .join("")}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {m.fullName}
                            </p>

                            <p className="text-xs text-gray-400">#{m.number}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {m.religion ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              RELIGION_BADGE[m.religion] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {m.religion}
                          </span>
                        ) : (
                          <span className="italic text-gray-300">
                            Belum diisi
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            m.gender === "M"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {m.gender === "M" ? "Pria" : "Wanita"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {m.age ? (
                          m.age
                        ) : (
                          <span className="italic text-gray-300">
                            Belum diisi
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center text-gray-400"
                      >
                        Tidak ada data yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card */}

          <div className="grid gap-3 md:hidden">
            {filtered.map((m) => (
              <div
                key={m._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                      m.gender === "M"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {m.fullName
                      ?.split(" ")
                      .slice(0, 2)
                      .map((x) => x[0])
                      .join("")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 break-words">
                        {m.fullName}
                      </h3>

                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        #{m.number}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          m.gender === "M"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {m.gender === "M" ? "Pria" : "Wanita"}
                      </span>

                      {m.religion ? (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            RELIGION_BADGE[m.religion] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {m.religion}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-400">
                          Agama belum diisi
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Tahun Lahir :</span>{" "}
                        {m.age || (
                          <span className="italic text-gray-400">
                            Belum diisi
                          </span>
                        )}
                      </p>

                      <p>
                        <span className="font-medium">Alamat :</span>{" "}
                        {m.address ? (
                          m.address
                        ) : (
                          <span className="italic text-gray-400">
                            Belum diisi
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
                Tidak ada data yang ditemukan.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Members;
