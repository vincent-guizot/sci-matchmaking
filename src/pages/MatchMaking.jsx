import React, { useState } from "react";
import Swal from "sweetalert2";
import useMembers from "../hooks/useMember";
import API from "../config/api";
import { FaMale, FaFemale, FaHeart } from "react-icons/fa";

const RELIGIONS = ["kristen", "katolik", "konghucu", "buddha"];

const MatchMaking = () => {
  const { members, loading } = useMembers();

  const [participantGender, setParticipantGender] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [filterReligion, setFilterReligion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const participant = members.find((m) => m._id === participantId);
  const oppositeGender = participant?.gender === "M" ? "F" : "M";

  // =====================
  // TOGGLE LIKE
  // =====================
  const toggleLike = (id) => {
    if (selectedLikes.includes(id)) {
      setSelectedLikes(selectedLikes.filter((x) => x !== id));
      return;
    }

    if (selectedLikes.length >= 4) {
      Swal.fire("Limit reached", "Max 4 likes allowed", "warning");
      return;
    }

    setSelectedLikes([...selectedLikes, id]);
  };

  // =====================
  // SUBMIT
  // =====================
  const submitLikes = async () => {
    if (!participantId || selectedLikes.length === 0) {
      Swal.fire("Error", "Choose participant & likes first", "error");
      return;
    }

    try {
      setSubmitting(true);

      await API.post("/likes/submit", {
        participantId,
        likes: selectedLikes,
      });

      Swal.fire("Success", "Likes submitted & matched!", "success");
      setSelectedLikes([]);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to submit",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================
  // FILTER CANDIDATES
  // =====================
  const filteredCandidates = members.filter((m) => {
    if (!participant) return false;
    if (m.gender !== oppositeGender) return false;
    if (m._id === participantId) return false;
    if (filterReligion && m.religion !== filterReligion) return false;
    return true;
  });

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-700">Match Making</h2>
        <p className="text-sm text-gray-500">
          Choose participant & select up to 4 people you like
        </p>
      </div>

      {/* =====================
          FILTER BAR
      ===================== */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
        {/* LEFT — Gender */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setParticipantGender("M");
              setParticipantId("");
              setSelectedLikes([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md transition
              ${
                participantGender === "M"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            <FaMale /> Man
          </button>

          <button
            onClick={() => {
              setParticipantGender("F");
              setParticipantId("");
              setSelectedLikes([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md transition
              ${
                participantGender === "F"
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            <FaFemale /> Woman
          </button>
        </div>

        {/* RIGHT — Religion */}
        <select
          value={filterReligion}
          onChange={(e) => setFilterReligion(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Religion</option>
          {RELIGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* =====================
          PARTICIPANT SELECT
      ===================== */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Select Participant
        </label>

        <select
          className="border px-3 py-2 w-full rounded"
          disabled={!participantGender}
          value={participantId}
          onChange={(e) => {
            setParticipantId(e.target.value);
            setSelectedLikes([]);
          }}
        >
          <option value="">Choose participant...</option>

          {members
            .filter((m) => m.gender === participantGender)
            .map((m) => (
              <option key={m._id} value={m._id}>
                {m.number} - {m.fullName}
              </option>
            ))}
        </select>
      </div>

      {/* =====================
          LIKE GRID
      ===================== */}
      {participant && (
        <>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Candidates ({oppositeGender === "M" ? "Man" : "Woman"})</span>
            <span>{selectedLikes.length} / 4 selected</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredCandidates.map((m) => {
              const active = selectedLikes.includes(m._id);
              const disabled = !active && selectedLikes.length >= 4;

              return (
                <div
                  key={m._id}
                  onClick={() => !disabled && toggleLike(m._id)}
                  className={`p-3 border text-center rounded-md transition
                    ${
                      active
                        ? "bg-green-600 text-white scale-105"
                        : disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:border-green-500 cursor-pointer"
                    }`}
                >
                  <p className="text-lg font-semibold">{m.fullName}</p>
                  {/* <p className="text-lg font-semibold">{m.number}</p> */}
                  <p className="text-xs opacity-80">{m.religion || "-"}</p>

                  {active && <FaHeart className="mx-auto mt-1 text-white" />}
                </div>
              );
            })}

            {filteredCandidates.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-6">
                No candidates match filter
              </div>
            )}
          </div>
        </>
      )}

      {/* =====================
          SUBMIT
      ===================== */}
      <button
        onClick={submitLikes}
        disabled={submitting || !participantId}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Likes"}
      </button>
    </div>
  );
};

export default MatchMaking;
