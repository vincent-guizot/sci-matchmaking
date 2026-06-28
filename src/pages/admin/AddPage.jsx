import React, { useState } from "react";
import Swal from "sweetalert2";
import API from "../../config/api";

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

const AddPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    number: "",
    address: "",
    religion: "",
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
        title: "Berhasil!",
        text: "Peserta berhasil ditambahkan",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
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
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, children }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 transition";

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tambah peserta</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Isi form di bawah untuk menambahkan peserta baru
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama lengkap">
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Nama lengkap"
                className={inputCls}
              />
            </Field>

            <Field label="Gender">
              <div className="flex gap-2">
                {[
                  { v: "M", l: "Pria" },
                  { v: "F", l: "Wanita" },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, gender: v }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                      formData.gender === v
                        ? v === "M"
                          ? "border-blue-400 bg-blue-50 text-blue-700"
                          : "border-pink-400 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nomor">
              <input
                name="number"
                type="number"
                value={formData.number}
                onChange={handleChange}
                required
                placeholder="No. peserta"
                className={inputCls}
              />
            </Field>
            <Field label="Tahun lahir">
              <input
                name="age"
                type="number"
                max={new Date().getFullYear()}
                value={formData.age}
                onChange={handleChange}
                placeholder="Cth: 1990"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Agama">
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">Pilih agama</option>
              {RELIGIONS.map((r) => (
                <option key={r.id} value={r.value} className="capitalize">
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Alamat/Kota">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Alamat lengkap (opsional)"
              rows={3}
              className={inputCls + " resize-none"}
            />
          </Field>

          <button
            type="submit"
            disabled={loading || !formData.fullName || !formData.number}
            className="w-full bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 mt-2"
          >
            {loading ? "Menyimpan..." : "Simpan peserta"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPage;
