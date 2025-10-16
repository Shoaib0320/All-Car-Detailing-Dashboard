"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function FancyLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* 🌌 Background glow orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25, scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-96 h-96 bg-blue-600/30 blur-[120px] top-[-80px] left-[-80px] rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25, scale: [1, 1.3, 1] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute w-96 h-96 bg-indigo-500/30 blur-[120px] bottom-[-80px] right-[-80px] rounded-full"
      />

      {/* 💎 Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="w-[400px] border border-slate-700/80 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(56,189,248,0.25)]">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Welcome Back 👋
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Sign in to access your dashboard
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-cyan-500/25">
                <LogIn size={18} />
                Sign In
              </Button>
            </motion.div>
          </CardContent>

          <Separator className="bg-slate-700/70" />

          <CardFooter className="text-center text-gray-400 text-sm">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              Sign up
            </a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
