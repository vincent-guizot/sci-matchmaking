import React, { useState } from "react";
import useMembers from "../hooks/useMember";

const Members = () => {
  const { members, loading } = useMembers();

  const [filterGender, setFilterGender] = useState("");
  const [filterReligion, setFilterReligion] = useState("");

  // 🔎 Filter logic
  const filteredMembers = members.filter((m) => {
    const genderMatch = filterGender ? m.gender === filterGender : true;
    const religionMatch = filterReligion
      ? String(m.religion) === filterReligion
      : true;

    return genderMatch && religionMatch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">
        Members List
      </h2>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* LEFT — Gender Filter */}
        <div className="flex gap-2">
          {["", "M", "F"].map((g) => (
            <button
              key={g}
              onClick={() => setFilterGender(g)}
              className={`px-4 py-2 text-sm border rounded-md transition
                ${
                  filterGender === g
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-gray-100"
                }`}
            >
              {g === "" ? "All" : g === "M" ? "Man" : "Woman"}
            </button>
          ))}
        </div>

        {/* RIGHT — Religion Dropdown */}
        <div className="w-full sm:w-60">
          <select
            value={filterReligion}
            onChange={(e) => setFilterReligion(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Religions</option>
            <option value="Kristen">Kristen</option>
            <option value="Katolik">Katolik</option>
            <option value="Buddha">Budha</option>
            <option value="Konghucu">Konghucu</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p className="text-center">Loading members...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[500px] w-full border border-gray-300 text-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2 text-left">Name</th>
                <th className="border px-3 py-2 text-left">Number</th>
                <th className="border px-3 py-2 text-left">Religion</th>
                <th className="border px-3 py-2 text-left">Birth Year</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50 transition">
                  <td className="border px-3 py-2">{member.fullName}</td>
                  <td className="border px-3 py-2">{member.number}</td>
                  <td className="border px-3 py-2">{member.religion}</td>
                  <td className="border px-3 py-2">{member.birthYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Members;
