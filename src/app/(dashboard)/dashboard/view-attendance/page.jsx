"use client";
import React, { useEffect, useState } from "react";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAttendance() {
    try {
      setLoading(true);
      const res = await fetch("/api/attendance");
      const json = await res.json();
      if (json.success) setAttendance(json.data || json);
      else setAttendance(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAttendance(); }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Attendance Overview</h1>
        <div className="flex gap-2">
          <a
            href="/api/attendance/export"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            📤 Export CSV
          </a>
          <button
            onClick={fetchAttendance}
            className="px-4 py-2 border rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Shift</th>
                  <th className="p-3 text-left">Check In</th>
                  <th className="p-3 text-left">Check Out</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Remarks</th>
                  <th className="p-3 text-left">Overtime</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-6 text-center text-gray-500"
                    >
                      No attendance records.
                    </td>
                  </tr>
                ) : (
                  attendance.map((a) => (
                    <tr
                      key={a._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">
                        {a.user?.firstName} {a.user?.lastName}
                      </td>
                      <td className="p-3">{a.shift?.name || "—"}</td>
                      <td className="p-3">
                        {a.checkInTime
                          ? new Date(a.checkInTime).toLocaleString()
                          : "—"}
                      </td>
                      <td className="p-3">
                        {a.checkOutTime
                          ? new Date(a.checkOutTime).toLocaleString()
                          : "—"}
                      </td>

                      {/* 🌍 Location */}
                      <td className="p-3">
                        {a.location
                          ? `${a.location.city || ""} ${
                              a.location.country || ""
                            }`
                          : "—"}
                      </td>

                      {/* 🟢 Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
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

                      {/* ⏰ Remarks */}
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
                          "—"
                        )}
                      </td>

                      {/* 🕒 Overtime */}
                      <td className="p-3">
                        {a.overtimeMinutes
                          ? `${a.overtimeMinutes} min`
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
