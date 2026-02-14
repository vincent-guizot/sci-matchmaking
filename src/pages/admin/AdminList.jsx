import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../config/api";

const AdminList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGender, setFilterGender] = useState("M");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/participants");
      setMembers(data);
    } catch (err) {
      Swal.fire("Error", "Failed fetch participants", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (m) => {
    const confirm = await Swal.fire({
      title: "Delete participant?",
      text: `${m.fullName} (${m.gender}-${m.number})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/participants/${m._id}`);

      Swal.fire({
        title: "Deleted",
        text: "Participant removed",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      fetchMembers();
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  const filteredMembers = filterGender
    ? members.filter((m) => m.gender === filterGender)
    : members;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-orange-600 text-center">
        Admin Participants List
      </h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {["M", "F"].map((g) => (
          <button
            key={g}
            onClick={() => setFilterGender(g)}
            className={`px-4 py-2 rounded-md border text-sm sm:text-base transition
              ${
                filterGender === g
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            {g === "M" ? "Man" : "Woman"}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center">Loading participants...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="min-w-[500px] w-full text-sm sm:text-base">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2 text-left">Name</th>
                <th className="border px-3 py-2 text-left">Number</th>
                <th className="border px-3 py-2 text-left">Religion</th>
                <th className="border px-3 py-2 text-left">Age</th>
                <th className="border px-3 py-2 text-left">Address</th>
                <th className="border px-3 py-2 text-left">Gender</th>
                {/* <th className="border px-3 py-2 text-left">Image</th> */}
                <th className="border px-3 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50 transition">
                  <td className="border px-3 py-2 font-medium">{m.fullName}</td>
                  <td className="border px-3 py-2">{m.number}</td>
                  <td className="border px-3 py-2">{m.religion || "-"}</td>
                  <td className="border px-3 py-2">{m.age || "-"}</td>
                  <td className="border px-3 py-2">{m.address || "-"}</td>
                  <td className="border px-3 py-2">{m.gender}</td>

                  {/* <td className="border px-3 py-2">
                    {m.image ? (
                      <img
                        src={m.image}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td> */}

                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handleDelete(m)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminList;
