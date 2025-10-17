"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
  });

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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Users</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(formData.role === 'Admin' || formData.role === 'SuperAdmin') && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/users', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                      });

                      const result = await response.json();

                      if (result.success) {
                        console.log('User created:', result.data);
                        setIsDialogOpen(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          address: '',
                          role: '',
                        });
                        // Optionally, refresh the users list here
                      } else {
                        console.error('Error creating user:', result.error);
                        // Optionally, show error message to user
                      }
                    } catch (error) {
                      console.error('Error:', error);
                      // Optionally, show error message to user
                    }
                  }}
                >
                  Save User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
