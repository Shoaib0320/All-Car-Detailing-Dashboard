// "use client";
// import { useEffect, useState } from "react";

// export default function SelectShift() {
//   const [shifts, setShifts] = useState([]);
//   const [selectedShift, setSelectedShift] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // 🔹 Fetch shifts
//   useEffect(() => {
//     async function fetchShifts() {
//       try {
//         const res = await fetch("/api/shifts");
//         const data = await res.json();
//         if (data.success) setShifts(data.data);
//       } catch (err) {
//         console.error("Error fetching shifts:", err);
//       }
//     }
//     fetchShifts();
//   }, []);

//   // 🔹 Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedShift) {
//       setMessage("Please select a shift first.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("/api/checkin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ shiftId: selectedShift }),
//       });

//       const data = await res.json();
//       setMessage(data.message || "Something went wrong.");
//     } catch (err) {
//       setMessage("Server error. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("Selected shift:", selectedShift);

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-2xl border border-gray-100">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//         🕓 Select Your Shift
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Dropdown */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             Select Shift
//           </label>
//           <select
//             value={selectedShift}
//             onChange={(e) => setSelectedShift(e.target.value)}
//             className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">-- Choose a shift --</option>
//             {shifts.map((shift) => (
//               <option key={shift._id} value={shift._id}>
//                 {shift.name} ({shift.startTime} - {shift.endTime})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Shift details */}
//         {selectedShift && (
//           <div className="bg-gray-50 border rounded-lg p-4 mt-2 space-y-2">
//             {shifts
//               .filter((s) => s._id === selectedShift)
//               .map((shift) => (
//                 <div key={shift._id}>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Shift Name:</span>{" "}
//                     {shift.name}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Timing:</span>{" "}
//                     {shift.startTime} - {shift.endTime}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Days:</span>{" "}
//                     {shift.days || "Mon–Fri"}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Manager:</span>{" "}
//                     {shift.manager
//                       ? `${shift.manager.firstName} ${shift.manager.lastName}`
//                       : "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-semibold">Email:</span>{" "}
//                     {shift.manager?.email || "Not available"}
//                   </p>
//                 </div>
//               ))}
//           </div>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2.5 px-4 rounded-lg text-white font-semibold transition ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Submitting..." : "Check In"}
//         </button>
//       </form>

//       {/* Message */}
//       {message && (
//         <p className="mt-4 text-center text-sm text-gray-700 font-medium">
//           {message}
//         </p>
//       )}
//     </div>
//   );
// }

// components/AdminCreateShift.jsx
"use client";
import React, { useEffect, useState } from "react";

const LIMIT = 10;

export default function AdminCreateShift() {
  const [form, setForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    hours: "",
    days: "",
    manager: "",
  });
  const [managers, setManagers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 0, page: 1, limit: LIMIT });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchManagers();
    fetchShifts(1);
  }, []);

  async function fetchManagers() {
    try {
      const res = await fetch("/api/users?role=manager");
      const data = await res.json();
      if (data.success) setManagers(data.data);
    } catch (err) {
      console.error("Error fetching managers", err);
    }
  }

  async function fetchShifts(page = 1, q = search, sBy = sortBy, sOrder = sortOrder) {
    try {
      const url = new URL("/api/shifts", location.origin);
      url.searchParams.set("page", page);
      url.searchParams.set("limit", LIMIT);
      url.searchParams.set("sortBy", sBy);
      url.searchParams.set("sortOrder", sOrder);
      if (q) url.searchParams.set("q", q);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (json.success) {
        setShifts(json.data);
        setMeta(json.meta || { total: 0, totalPages: 0, page, limit: LIMIT });
      } else {
        setMessage(json.message || "Failed to load shifts");
      }
    } catch (err) {
      console.error("fetchShifts error", err);
      setMessage("Server error while fetching shifts");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const toggleDay = (d) => {
    setForm((s) => {
      const cur = Array.isArray(s.days) ? s.days : s.days ? [s.days] : [];
      if (cur.includes(d)) return { ...s, days: cur.filter((x) => x !== d) };
      return { ...s, days: [...cur, d] };
    });
  };

  const resetForm = () =>
    setForm({ name: "", startTime: "", endTime: "", hours: "", days: [], manager: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        name: form.name,
        startTime: form.startTime,
        endTime: form.endTime,
        hours: Number(form.hours),
        days: Array.isArray(form.days) ? form.days : form.days ? [form.days] : [],
        manager: form.manager || null,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/shifts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/shifts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const json = await res.json();
      setMessage(json.message || (json.success ? "Done" : "Error"));

      if (json.success) {
        resetForm();
        setEditingId(null);
        fetchShifts(meta.page);
      }
    } catch (err) {
      console.error("submit error", err);
      setMessage("Server error while saving");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (shift) => {
    setEditingId(shift._id);
    setForm({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      hours: shift.hours ?? "",
      days: shift.days ?? [],
      manager: shift.manager?._id ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will delete the shift.")) return;
    try {
      const res = await fetch(`/api/shifts/${id}`, { method: "DELETE" });
      const json = await res.json();
      setMessage(json.message || (json.success ? "Deleted" : "Error"));
      if (json.success) fetchShifts(meta.page);
    } catch (err) {
      console.error("delete error", err);
      setMessage("Server error while deleting");
    }
  };

  const goToPage = (p) => {
    if (p < 1 || p > (meta.totalPages || 1)) return;
    fetchShifts(p);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      fetchShifts(1, search, field, newOrder);
    } else {
      setSortBy(field);
      setSortOrder("desc");
      fetchShifts(1, search, field, "desc");
    }
  };

  // 🔍 LIVE SEARCH (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchShifts(1, search);
    }, 500); // 0.5 sec after typing stop
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const pageNumbers = Array.from({ length: meta.totalPages || 0 }, (_, i) => i + 1);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Shift Admin — Create / Manage</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-5 rounded shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input required name="name" value={form.name} onChange={handleChange} placeholder="Shift name" className="p-2 border rounded dark:bg-gray-800" />
          <input required name="startTime" type="time" value={form.startTime} onChange={handleChange} className="p-2 border rounded dark:bg-gray-800" />
          <input required name="endTime" type="time" value={form.endTime} onChange={handleChange} className="p-2 border rounded dark:bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input required name="hours" type="number" min="1" value={form.hours} onChange={handleChange} placeholder="Hours (e.g. 8)" className="p-2 border rounded dark:bg-gray-800" />

          <div className="p-2 border rounded dark:bg-gray-800">
            <p className="text-sm font-medium mb-2">Select Days</p>
            <div className="flex flex-wrap gap-2">
              {dayOptions.map((d) => {
                const selected = Array.isArray(form.days) ? form.days.includes(d) : false;
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1 rounded border ${selected ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700"}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <select name="manager" value={form.manager} onChange={handleChange} className="p-2 border rounded dark:bg-gray-800">
            <option value="">Assign Manager (optional)</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.firstName} {m.lastName} ({m.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            {editingId ? "Update Shift" : "Create Shift"}
          </button>
          <button type="button" onClick={() => { resetForm(); setEditingId(null); }} className="px-4 py-2 bg-gray-300 rounded">
            Reset
          </button>
        </div>

        {message && <p className="text-sm text-center text-gray-700 dark:text-gray-300">{message}</p>}
      </form>

      {/* 🔍 Search + sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex gap-2 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name / manager / days"
            className="p-2 border rounded dark:bg-gray-800"
          />
          <button onClick={() => fetchShifts(1, search)} className="px-3 py-2 bg-blue-600 text-white rounded">
            Search
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm">Sort:</label>
          <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="p-2 border rounded dark:bg-gray-800">
            <option value="createdAt">Created (new → old)</option>
            <option value="name">Name (A → Z)</option>
            <option value="hours">Hours</option>
          </select>
          <button
            onClick={() => {
              const newOrder = sortOrder === "asc" ? "desc" : "asc";
              setSortOrder(newOrder);
              fetchShifts(1, search, sortBy, newOrder);
            }}
            className="px-2 py-1 border rounded"
          >
            {sortOrder === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {/* Shift List */}
      <div className="space-y-3">
        {shifts.length === 0 ? (
          <p className="text-center text-gray-500">No shifts found.</p>
        ) : (
          shifts.map((shift) => (
            <div key={shift._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div>
                <h4 className="font-semibold">{shift.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {shift.startTime} - {shift.endTime} • {shift.hours} hrs •{" "}
                  {shift.days && shift.days.length ? shift.days.join(", ") : "No days"}
                </p>
                <p className="text-sm text-gray-500">
                  Manager:{" "}
                  {shift.manager ? `${shift.manager.firstName} ${shift.manager.lastName} (${shift.manager.email})` : "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(shift)} className="px-3 py-1 bg-yellow-400 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(shift._id)} className="px-3 py-1 bg-red-500 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {pageNumbers.length > 0 &&
          pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 rounded ${p === meta.page ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              {p}
            </button>
          ))}
      </div>
    </div>
  );
}
