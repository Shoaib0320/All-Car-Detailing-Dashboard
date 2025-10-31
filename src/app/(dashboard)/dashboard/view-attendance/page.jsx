"use client";
import React, { useEffect, useState } from "react";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const LIMIT = 10;

  // ✅ Toast Notification
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  };

  // ✅ Fetch Attendance Data
  async function fetchAttendance(pageNum = 1) {
    try {
      setLoading(true);
      const res = await fetch(`/api/attendance?page=${pageNum}&limit=${LIMIT}`);
      const json = await res.json();
      if (json.success) {
        setAttendance(json.data || []);
        setMeta(json.meta || { total: json.data?.length || 0, totalPages: 1 });
        showToast("Attendance data loaded successfully", "success");
      } else {
        showToast("Failed to load attendance", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error while fetching data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAttendance(page);
  }, [page]);

  const goToNextPage = () => {
    if (page < meta.totalPages) setPage((p) => p + 1);
  };

  const goToPrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return (
    <div className="relative p-6">
      {/* 🔔 Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white transition-all ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">📋 Attendance Overview</h1>
        <div className="flex gap-2">
          <a
            href="/api/attendance/export"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            Export CSV
          </a>
          <button
            onClick={() => fetchAttendance(page)}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">
          Loading attendance records...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                <th className="p-3">User</th>
                <th className="p-3">Shift</th>
                <th className="p-3">Check In</th>
                <th className="p-3">Check Out</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="p-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {a.user?.firstName} {a.user?.lastName}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">
                      {a.shift?.name || "—"}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">
                      {a.checkInTime
                        ? new Date(a.checkInTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">
                      {a.checkOutTime
                        ? new Date(a.checkOutTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">
                      {a.location
                        ? `${a.location.city || ""} ${a.location.country || ""}`
                        : "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          a.status === "present"
                            ? "bg-green-100 text-green-700"
                            : a.status === "absent"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {a.isLate ? (
                        <span className="text-yellow-600">
                          Late ({a.lateMinutes}m)
                        </span>
                      ) : a.isOvertime ? (
                        <span className="text-green-600">
                          Overtime (+{a.overtimeMinutes}m)
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center mt-6 items-center gap-3">
          <button
            onClick={goToPrevPage}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300 text-sm">
            Page {page} of {meta.totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={page === meta.totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
