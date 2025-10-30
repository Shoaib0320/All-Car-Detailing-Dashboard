// "use client";

// import { useEffect, useState } from "react";
// import DataTable from "@/components/common/DataTable";
// import SummaryCards from "@/components/common/SummaryCards";
// import PageHeader from "@/components/common/PageHeader";
// import BookingSearchBar from "@/components/SearchBar";
// import SearchResultCard from "@/components/common/SearchResultCard";
// import BookingDetailsDialog from "@/components/BookingDetailsDialog";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { fetchBookings } from "@/action/bookingActions";
// import { CalendarDays, CheckCircle, Clock, XCircle, RefreshCcw, CheckSquare } from "lucide-react";
// // import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react";


// export default function BookingsPage() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const fadeUp = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i = 1) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
//     }),
//   };

//   // 🧠 Fetch bookings
//   useEffect(() => {
//     async function loadBookings() {
//       try {
//         const res = await fetchBookings();
//         setBookings(res.data || []);
//       } catch (err) {
//         console.error("Error fetching bookings:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadBookings();
//   }, []);

//   // 🔍 Search handler
//   const handleSearch = (query) => setSearch(query);

//   // 🔎 Filter bookings
//   const filteredBookings = bookings.filter((b) =>
//     b.formData?.firstName?.toLowerCase().includes(search.toLowerCase())
//   );

//   const isSearching = search.trim().length > 0;

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <PageHeader
//         title="Bookings Overview"
//         description="Manage, track, and monitor all bookings in one place."
//         icon={CalendarDays}
//       />

//       {/* Search Bar */}
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         custom={1}
//         variants={fadeUp}
//         className="flex flex-col sm:flex-row gap-3"
//       >
//         <BookingSearchBar onSearch={handleSearch} />
//       </motion.div>

//       <Separator />

//       {/* If searching → show search results */}
//       {isSearching ? (
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={fadeUp}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-center items-center py-6"
//         >
//           {filteredBookings.length === 0 ? (
//             <p className="text-center text-gray-500 col-span-full">
//               No results found for <strong>{search}</strong>.
//             </p>
//           ) : (
//             filteredBookings.map((booking, index) => (
//               <SearchResultCard
//                 key={booking._id}
//                 item={booking}
//                 index={index}
//                 fadeUp={fadeUp}
//                 type="booking"
//                 onViewDetails={(b) => {
//                   setSelectedBooking(b);
//                   setDialogOpen(true);
//                 }}
//               />
//             ))
//           )}
//         </motion.div>
//       ) : (
//         <>
//           {/* Summary Cards */}
//           <SummaryCards
//             cards={[
//               {
//                 title: "Total Bookings",
//                 description: "All bookings to date",
//                 value: bookings.length,
//                 icon: CalendarDays,
//                 color: "from-blue-500/10 to-blue-500/5 text-blue-700",
//               },
//               {
//                 title: "Confirmed",
//                 description: "Active and approved",
//                 value: bookings.filter((b) => b.status === "confirmed").length,
//                 icon: CheckCircle,
//                 color: "from-green-500/10 to-green-500/5 text-green-700",
//               },
//               {
//                 title: "Pending",
//                 description: "Awaiting confirmation",
//                 value: bookings.filter((b) => b.status === "pending").length,
//                 icon: Clock,
//                 color: "from-yellow-500/10 to-yellow-500/5 text-yellow-700",
//               },
//               {
//                 title: "Cancelled",
//                 description: "Declined or cancelled",
//                 value: bookings.filter((b) => b.status === "cancelled").length,
//                 icon: XCircle,
//                 color: "from-red-500/10 to-red-500/5 text-red-700",
//               },
//             ]}
//           />

//           <Separator />

//           {/* Normal Table (only visible when not searching) */}
//           <DataTable
//             title="Recent Bookings"
//             icon={Clock}
//             loading={loading}
//             data={bookings}
//             columns={[
//               { key: "bookingId", label: "Booking ID" },
//               {
//                 label: "Customer",
//                 render: (b) =>
//                   `${b.formData?.firstName || ""} ${
//                     b.formData?.lastName || ""
//                   }`,
//               },
//               { label: "Email", render: (b) => b.formData?.email || "N/A" },
//               {
//                 label: "Date",
//                 render: (b) => new Date(b.createdAt).toLocaleDateString(),
//               },
//               {
//                 label: "Status",
//                 render: (b) => (
//                   <span
//                     className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${
//                       b.status === "confirmed"
//                         ? "bg-green-100 text-green-700"
//                         : b.status === "pending"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {b.status === "confirmed" && (
//                       <CheckCircle className="w-3.5 h-3.5" />
//                     )}
//                     {b.status === "pending" && (
//                       <Clock className="w-3.5 h-3.5" />
//                     )}
//                     {b.status === "cancelled" && (
//                       <XCircle className="w-3.5 h-3.5" />
//                     )}
//                     <span className="capitalize">{b.status}</span>
//                   </span>
//                 ),
//               },
//               {
//                 label: "Action",
//                 align: "right",
//                 render: (b) => (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setSelectedBooking(b);
//                       setDialogOpen(true);
//                     }}
//                   >
//                     View
//                   </Button>
//                 ),
//               },
//             ]}
//           />
//         </>
//       )}

//       {/* Dialog */}
//       {/* Dialog */}
//       <BookingDetailsDialog
//         booking={selectedBooking}
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         onStatusChange={(updatedBooking) => {
//           setBookings((prev) =>
//             prev.map(
//               (b) => (b._id === updatedBooking._id ? updatedBooking : b) // ✅ pura updated object lagao
//             )
//           );

//           // ✅ Dialog me bhi updated booking show karne ke liye
//           setSelectedBooking(updatedBooking);
//         }}
//       />
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/common/DataTable";
import SummaryCards from "@/components/common/SummaryCards";
import PageHeader from "@/components/common/PageHeader";
import BookingSearchBar from "@/components/SearchBar";
import SearchResultCard from "@/components/common/SearchResultCard";
import BookingDetailsDialog from "@/components/BookingDetailsDialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchBookings } from "@/action/bookingActions";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCcw,
  CheckSquare,
} from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  // 🧠 Fetch bookings
  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetchBookings();
        setBookings(res.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  // 🔍 Search handler
  const handleSearch = (query) => setSearch(query);

  // 🔎 Filter bookings
  const filteredBookings = bookings.filter((b) =>
    b.formData?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  const isSearching = search.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Bookings Overview"
        description="Manage, track, and monitor all bookings in one place."
        icon={CalendarDays}
      />

      {/* Search Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
        className="flex flex-col sm:flex-row gap-3"
      >
        <BookingSearchBar onSearch={handleSearch} />
      </motion.div>

      <Separator />

      {/* If searching → show search results */}
      {isSearching ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-center items-center py-6"
        >
          {filteredBookings.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No results found for <strong>{search}</strong>.
            </p>
          ) : (
            filteredBookings.map((booking, index) => (
              <SearchResultCard
                key={booking._id}
                item={booking}
                index={index}
                fadeUp={fadeUp}
                type="booking"
                onViewDetails={(b) => {
                  setSelectedBooking(b);
                  setDialogOpen(true);
                }}
              />
            ))
          )}
        </motion.div>
      ) : (
        <>
          {/* Summary Cards */}
          <SummaryCards
            cards={[
              {
                title: "Total Bookings",
                description: "All bookings to date",
                value: bookings.length,
                icon: CalendarDays,
                color: "from-blue-500/10 to-blue-500/5 text-blue-700",
              },
              {
                title: "Confirmed",
                description: "Active and approved",
                value: bookings.filter((b) => b.status === "confirmed").length,
                icon: CheckCircle,
                color: "from-green-500/10 to-green-500/5 text-green-700",
              },
              {
                title: "Pending",
                description: "Awaiting confirmation",
                value: bookings.filter((b) => b.status === "pending").length,
                icon: Clock,
                color: "from-yellow-500/10 to-yellow-500/5 text-yellow-700",
              },
              {
                title: "Completed",
                description: "Finished bookings",
                value: bookings.filter((b) => b.status === "completed").length,
                icon: CheckSquare,
                color: "from-purple-500/10 to-purple-500/5 text-purple-700",
              },
              {
                title: "Rescheduled",
                description: "Changed date/time",
                value: bookings.filter((b) => b.status === "rescheduled").length,
                icon: RefreshCcw,
                color: "from-blue-500/10 to-blue-500/5 text-blue-700",
              },
              {
                title: "Cancelled",
                description: "Declined or cancelled",
                value: bookings.filter((b) => b.status === "cancelled").length,
                icon: XCircle,
                color: "from-red-500/10 to-red-500/5 text-red-700",
              },
            ]}
          />

          <Separator />

          {/* Table */}
          <DataTable
            title="Recent Bookings"
            icon={Clock}
            loading={loading}
            data={bookings}
            columns={[
              { key: "bookingId", label: "Booking ID" },
              {
                label: "Customer",
                render: (b) =>
                  `${b.formData?.firstName || ""} ${
                    b.formData?.lastName || ""
                  }`.trim(),
              },
              { label: "Email", render: (b) => b.formData?.email || "N/A" },
              {
                label: "Date",
                render: (b) =>
                  new Date(b.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }),
              },
              {
                label: "Status",
                render: (b) => (
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : b.status === "rescheduled"
                        ? "bg-blue-100 text-blue-700"
                        : b.status === "completed"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.status === "confirmed" && (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    {b.status === "pending" && <Clock className="w-3.5 h-3.5" />}
                    {b.status === "cancelled" && (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    {b.status === "rescheduled" && (
                      <RefreshCcw className="w-3.5 h-3.5" />
                    )}
                    {b.status === "completed" && (
                      <CheckSquare className="w-3.5 h-3.5" />
                    )}
                    <span className="capitalize">{b.status}</span>
                  </span>
                ),
              },
              {
                label: "Action",
                align: "right",
                render: (b) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(b);
                      setDialogOpen(true);
                    }}
                    disabled={b.status === "completed"}
                  >
                    {b.status === "completed" ? "Completed" : "View"}
                  </Button>
                ),
              },
            ]}
          />
        </>
      )}

      {/* Dialog */}
      <BookingDetailsDialog
        booking={selectedBooking}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStatusChange={(updatedBooking) => {
          setBookings((prev) =>
            prev.map((b) =>
              b._id === updatedBooking._id ? updatedBooking : b
            )
          );
          setSelectedBooking(updatedBooking);
        }}
      />
    </div>
  );
}
