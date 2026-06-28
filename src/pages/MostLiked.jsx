import React, { useEffect, useState } from "react";
import API from "../config/api";

const RELIGION_COLORS = {
  kristen: "bg-blue-100 text-blue-700",
  katolik: "bg-pink-100 text-pink-700",
  buddha: "bg-green-100 text-green-700",
  konghucu: "bg-amber-100 text-amber-700",
};

const medalColors = ["text-amber-400", "text-gray-400", "text-amber-600"];
const medalLabels = ["🥇", "🥈", "🥉"];

const RankCard = ({ title, data, genderColor, emptyText }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className={`px-5 py-3.5 border-b border-gray-100 ${genderColor}`}>
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    {data.length === 0 ? (
      <p className="text-center text-gray-400 py-10 text-sm">{emptyText}</p>
    ) : (
      <ul className="divide-y divide-gray-50">
        {data.map((p, i) => (
          <li key={p._id || p.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
            <span className="text-lg w-7 text-center flex-shrink-0">
              {i < 3 ? medalLabels[i] : <span className="text-gray-400 text-sm font-medium">#{i + 1}</span>}
            </span>

            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ background: i === 0 ? "#fef3c7" : "#f3f4f6", color: i === 0 ? "#92400e" : "#6b7280" }}
            >
              {(p.fullName || p.name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("")}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{p.fullName || p.name}</p>
              {p.religion && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RELIGION_COLORS[p.religion] || "bg-gray-100 text-gray-600"}`}>
                  {p.religion}
                </span>
              )}
            </div>

            <div className="flex-shrink-0 text-right">
              <span className="text-lg font-bold text-rose-500">{p.count}</span>
              <p className="text-xs text-gray-400">likes</p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const MostLiked = () => {
  const [likesData, setLikesData] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [likesRes, membersRes] = await Promise.all([
          API.get("/likes"),
          API.get("/participants"),
        ]);
        setLikesData(likesRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Hitung total likes per orang yang DISUKAI (bukan yang menyukai)
  const likeCountMap = {};
  likesData.forEach((row) => {
    row.likes?.forEach((liked) => {
      const id = liked._id;
      likeCountMap[id] = (likeCountMap[id] || { ...liked, count: 0 });
      likeCountMap[id].count += 1;
    });
  });

  const allRanked = Object.values(likeCountMap).sort((a, b) => b.count - a.count);

  // Gabungkan dengan data gender dari members
  const memberMap = {};
  members.forEach((m) => { memberMap[m._id] = m; });

  const enriched = allRanked.map((p) => ({
    ...p,
    gender: memberMap[p._id]?.gender || p.gender,
    religion: memberMap[p._id]?.religion || p.religion,
  }));

  const menRanked = enriched.filter((p) => p.gender === "M");
  const womenRanked = enriched.filter((p) => p.gender === "F");

  const totalLikes = allRanked.reduce((s, p) => s + p.count, 0);
  const totalMenLikes = menRanked.reduce((s, p) => s + p.count, 0);
  const totalWomenLikes = womenRanked.reduce((s, p) => s + p.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Most liked</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ranking peserta berdasarkan total likes yang diterima
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total semua likes", value: totalLikes, color: "text-rose-500" },
          { label: "Total likes pria", value: totalMenLikes, color: "text-blue-500" },
          { label: "Total likes wanita", value: totalWomenLikes, color: "text-pink-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Top 1 Highlights */}
      {(menRanked[0] || womenRanked[0]) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menRanked[0] && (
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                {menRanked[0].fullName?.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
              <div>
                <p className="text-xs text-blue-400 font-medium uppercase tracking-wide">Pria paling disukai</p>
                <p className="font-bold text-gray-800">{menRanked[0].fullName}</p>
                <p className="text-rose-500 font-semibold">{menRanked[0].count} likes</p>
              </div>
              <span className="ml-auto text-3xl">🥇</span>
            </div>
          )}
          {womenRanked[0] && (
            <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-lg">
                {womenRanked[0].fullName?.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
              <div>
                <p className="text-xs text-pink-400 font-medium uppercase tracking-wide">Wanita paling disukai</p>
                <p className="font-bold text-gray-800">{womenRanked[0].fullName}</p>
                <p className="text-rose-500 font-semibold">{womenRanked[0].count} likes</p>
              </div>
              <span className="ml-auto text-3xl">🥇</span>
            </div>
          )}
        </div>
      )}

      {/* Ranking tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <RankCard
          title="👨 Pria paling disukai"
          data={menRanked.slice(0, 10)}
          genderColor="bg-blue-50 text-blue-700"
          emptyText="Belum ada data"
        />
        <RankCard
          title="👩 Wanita paling disukai"
          data={womenRanked.slice(0, 10)}
          genderColor="bg-pink-50 text-pink-700"
          emptyText="Belum ada data"
        />
      </div>

      {/* Full list */}
      {allRanked.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-sm text-gray-700">Semua peserta — ranking gabungan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-5 py-3 text-left w-12">#</th>
                  <th className="px-5 py-3 text-left">Nama</th>
                  <th className="px-5 py-3 text-left">Agama</th>
                  <th className="px-5 py-3 text-left">Gender</th>
                  <th className="px-5 py-3 text-right">Total likes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enriched.map((p, i) => (
                  <tr key={p._id || p.name} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-gray-400 font-medium">{i < 3 ? medalLabels[i] : `#${i + 1}`}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{p.fullName || p.name}</td>
                    <td className="px-5 py-3">
                      {p.religion ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RELIGION_COLORS[p.religion] || "bg-gray-100 text-gray-600"}`}>
                          {p.religion}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.gender === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                        {p.gender === "M" ? "Pria" : "Wanita"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-rose-500">{p.count}</td>
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

export default MostLiked;
