"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, messagesRes] = await Promise.all([
          fetch("/api/booking"),
          fetch("/api/contact"),
        ]);

        const bookingsData = await bookingsRes.json();
        const messagesData = await messagesRes.json();

        setBookings(bookingsData?.data || []);
        setMessages(messagesData?.data || []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading dashboard...
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
           Admin Overview
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-lg font-semibold">Total Bookings</h2>
            <p className="text-3xl font-bold mt-2">{bookings.length}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-lg font-semibold">Contact Messages</h2>
            <p className="text-3xl font-bold mt-2">{messages.length}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/api/booking"
            target="_blank"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🔗 View Bookings API
          </a>
          <a
            href="/api/contact"
            target="_blank"
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            🔗 View Contact API
          </a>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            ⚙️ Vercel Dashboard
          </a>

          {/* 🧭 Go to Dashboard Button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            🧭 Go to Dashboard
          </button>
        </div>
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        Built with Gobium Cloud | Powered by Next.js + MongoDB
      </footer>
    </main>
  );
}
