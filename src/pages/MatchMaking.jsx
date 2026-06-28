import React, { useState } from "react";
import Swal from "sweetalert2";
import useMembers from "../hooks/useMember";
import API from "../config/api";

const RELIGIONS = ["kristen", "katolik", "konghucu", "buddha"];

const RELIGION_BADGE = {
  kristen: "bg-blue-100 text-blue-700",
  katolik: "bg-pink-100 text-pink-700",
  buddha: "bg-green-100 text-green-700",
  konghucu: "bg-amber-100 text-amber-700",
};

const MatchMaking = () => {
  const { members, loading } = useMembers();
  const [participantGender, setParticipantGender] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [filterReligion, setFilterReligion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const participant = members.find((m) => m._id === participantId);
  const oppositeGender = participant?.gender === "M" ? "F" : "M";

  const toggleLike = (id) => {
    if (selectedLikes.includes(id)) {
      setSelectedLikes(selectedLikes.filter((x) => x !== id));
      return;
    }
    if (selectedLikes.length >= 4) {
      Swal.fire({
        title: "Batas tercapai",
        text: "Maksimal 4 pilihan",
        icon: "warning",
      });
      return;
    }
    setSelectedLikes([...selectedLikes, id]);
  };

  const submitLikes = async () => {
    if (!participantId || selectedLikes.length === 0) {
      Swal.fire({
        title: "Perhatian",
        text: "Pilih peserta dan minimal 1 kandidat",
        icon: "error",
      });
      return;
    }
    try {
      setSubmitting(true);
      await API.post("/likes/submit", { participantId, likes: selectedLikes });
      Swal.fire({
        title: "Berhasil!",
        text: "Pilihan berhasil disimpan",
        icon: "success",
      });
      setSelectedLikes([]);
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: err.response?.data?.message || "Terjadi kesalahan",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCandidates = members.filter((m) => {
    if (!participant) return false;
    if (m.gender !== oppositeGender) return false;
    if (m._id === participantId) return false;
    if (filterReligion && m.religion !== filterReligion) return false;
    return true;
  });

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
      <div>
        <h2 className="text-xl font-bold text-gray-900">Matchmaking</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Pilih peserta lalu tentukan hingga 4 kandidat pilihan
        </p>
      </div>

      {/* Step 1 — Gender + participant */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Langkah 1 — Pilih peserta
        </p>

        <div className="flex gap-2">
          {[
            { v: "M", l: "Pria", cls: "bg-blue-500 hover:bg-blue-600" },
            { v: "F", l: "Wanita", cls: "bg-pink-500 hover:bg-pink-600" },
          ].map(({ v, l, cls }) => (
            <button
              key={v}
              onClick={() => {
                setParticipantGender(v);
                setParticipantId("");
                setSelectedLikes([]);
              }}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                participantGender === v
                  ? `${cls} text-white`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <select
          disabled={!participantGender}
          value={participantId}
          onChange={(e) => {
            setParticipantId(e.target.value);
            setSelectedLikes([]);
          }}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Pilih peserta...</option>
          {members
            .filter((m) => m.gender === participantGender)
            .map((m) => (
              <option key={m._id} value={m._id}>
                {m.number} — {m.fullName}
              </option>
            ))}
        </select>
      </div>

      {/* Step 2 — Candidates */}
      {participant && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Langkah 2 — Pilih kandidat (
              {oppositeGender === "F" ? "Wanita" : "Pria"})
            </p>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${selectedLikes.length >= 4 ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-600"}`}
            >
              {selectedLikes.length} / 4 dipilih
            </span>
          </div>

          {/* Religion filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterReligion("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${!filterReligion ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Semua
            </button>
            {RELIGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setFilterReligion(r === filterReligion ? "" : r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${filterReligion === r ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Candidate grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredCandidates.map((m) => {
              const active = selectedLikes.includes(m._id);
              const disabled = !active && selectedLikes.length >= 4;
              return (
                <div
                  key={m._id}
                  onClick={() => !disabled && toggleLike(m._id)}
                  className={`relative p-4 border-2 rounded-xl text-center cursor-pointer transition-all select-none ${
                    active
                      ? "border-rose-400 bg-rose-50"
                      : disabled
                        ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                        : "border-gray-100 hover:border-rose-200 hover:bg-rose-50/50"
                  }`}
                >
                  {active && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-semibold ${oppositeGender === "F" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {m.fullName
                      ?.split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {m.fullName}
                  </p>
                  {m.religion && (
                    <span
                      className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${RELIGION_BADGE[m.religion] || "bg-gray-100 text-gray-600"}`}
                    >
                      {m.religion}
                    </span>
                  )}
                </div>
              );
            })}
            {filteredCandidates.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400 text-sm">
                Tidak ada kandidat yang sesuai filter
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      {participant && (
        <button
          onClick={submitLikes}
          disabled={submitting || selectedLikes.length === 0}
          className="w-full bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Menyimpan..."
            : `Simpan pilihan (${selectedLikes.length} dipilih)`}
        </button>
      )}
    </div>
  );
};

export default MatchMaking;
