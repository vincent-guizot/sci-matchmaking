import React, { useState } from "react";
import Swal from "sweetalert2";
import API from "../../config/api";

const RELIGIONS = ["Kristen", "Katolik", "Konghucu", "Buddha"];

const AdminAdd = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    number: "",
    address: "",
    religion: "", // ✅ default ALL
    age: "",
    image: "",
    gender: "M",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "number" || name === "age"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/participants", formData);

      await Swal.fire({
        title: "Success",
        text: "Participant added successfully",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });

      // ✅ reset form
      setFormData({
        fullName: "",
        number: "",
        address: "",
        religion: "",
        age: "",
        image: "",
        gender: "M",
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed add participant",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-orange-600 text-center mb-6">
        Admin Add Participant
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-gray-300 rounded-lg p-5 bg-white shadow-sm"
      >
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* Number */}
        <div>
          <label className="block mb-1 font-medium">Number</label>
          <input
            name="number"
            type="number"
            value={formData.number}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* Religion */}
        <div>
          <label className="block mb-1 font-medium">Religion</label>
          <select
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="">Choose</option>
            {RELIGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Birth Year */}
        <div>
          <label className="block mb-1 font-medium">Birth Year</label>
          <input
            name="age"
            type="number"
            max={new Date().getFullYear()}
            value={formData.age}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="M">Man</option>
            <option value="F">Woman</option>
          </select>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Participant"}
        </button>
      </form>
    </div>
  );
};

export default AdminAdd;
