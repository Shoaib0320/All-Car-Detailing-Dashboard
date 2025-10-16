"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
import SummaryCards from "@/components/common/SummaryCards";
import DataTable from "@/components/common/DataTable";
import SearchResultCard from "@/components/common/SearchResultCard";
import BookingSearchBar from "@/components/SearchBar";
import { fetchContacts } from "@/action/contactActions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  MessageSquare,
  UserPlus,
  Search,
  Inbox,
  CheckCircle,
  Loader,
  Eye,
} from "lucide-react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const data = await fetchContacts();
        setContacts(
          Array.isArray(data) ? data : data.contacts || data.data || []
        );
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  // 🔍 Search handler
  const handleSearch = (query) => setSearch(query);

  // 🔎 Filter contacts
  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const isSearching = search.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}

      <PageHeader
        title="Contact Center"
        description="Manage customer inquiries, messages, and feedback."
        icon={Phone}
      />

      {/* Search Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
        className="flex items-center gap-3 flex-wrap"
      >
        <BookingSearchBar
          onSearch={handleSearch}
          placeholder="Search contacts..."
        />
      </motion.div>

      <Separator />

      {/* If searching → show search results */}
      {isSearching ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-center items-center py-6"
        >
          {filteredContacts.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No results found for <strong>{search}</strong>.
            </p>
          ) : (
            filteredContacts.map((contact, index) => (
              <SearchResultCard
                key={contact._id}
                item={contact}
                index={index}
                fadeUp={fadeUp}
                type="contact"
                onViewDetails={(c) => console.log("Contact details:", c)}
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
                title: "Total Contacts",
                value: contacts.length,
                description: "All received messages",
                color: "from-blue-500/10 to-blue-500/5 text-blue-700",
                icon: Inbox,
              },
              {
                title: "New Contacts",
                value: contacts.filter((c) => c.status === "New").length,
                description: "Unread messages",
                color: "from-green-500/10 to-green-500/5 text-green-700",
                icon: MessageSquare,
              },
              {
                title: "In Progress",
                value: contacts.filter((c) => c.status === "In Progress")
                  .length,
                description: "Currently managed",
                color: "from-yellow-500/10 to-yellow-500/5 text-yellow-700",
                icon: Loader,
              },
              {
                title: "Resolved",
                value: contacts.filter((c) => c.status === "Resolved").length,
                description: "Handled successfully",
                color: "from-red-500/10 to-red-500/5 text-red-700",
                icon: CheckCircle,
              },
            ]}
          />

          <Separator />

          {/* Contact Messages Table */}
          <DataTable
            title="Recent Messages"
            icon={MessageSquare}
            loading={loading}
            data={contacts}
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              {
                key: "message",
                label: "Message",
                render: (c) => {
                  if (!c.message) return "No message";
                  const words = c.message.split(" ");
                  return (
                    words.slice(0, 4).join(" ") +
                    (words.length > 4 ? "..." : "")
                  );
                },
              },
              {
                key: "status",
                label: "Status",
                render: (c) => (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      c.status === "New"
                        ? "bg-blue-100 text-blue-700"
                        : c.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.status}
                  </span>
                ),
              },
              {
                label: "Action",
                align: "right",
                render: (c) => (
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
