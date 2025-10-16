"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
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
import { Users, UserPlus, Search } from "lucide-react";

export default function UsersPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      name: "Sarah Smith",
      email: "sarah@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Viewer",
      status: "Pending",
    },
    {
      name: "Anna Brown",
      email: "anna@example.com",
      role: "Moderator",
      status: "Inactive",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <PageHeader
        title=" Users Management"
        description=" Manage all users, roles, and permissions from here."
        icon={Users}
      />

      {/* Search & Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
        className="flex items-center gap-3 flex-wrap"
      >
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search users..." className="pl-9" />
        </div>
        <Button variant="outline">Filter</Button>
      </motion.div>

      <Separator />

      {/* User Cards Summary */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={2}
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <Card className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Registered in system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,245</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Logged in this week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">1,003</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Pending Users</CardTitle>
            <CardDescription>Awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">57</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Deactivated</CardTitle>
            <CardDescription>Suspended accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">22</p>
          </CardContent>
        </Card>
      </motion.div>

      <Separator />

      {/* User List Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={3}
        variants={fadeUp}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">All Users</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : user.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
