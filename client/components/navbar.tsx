"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { Menu, X, Sparkles, LogOut, LayoutDashboard, User, MessageCircle } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "BRAND"
        ? "/brand/dashboard"
        : "/influencer/dashboard";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-ink"
        >
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span>
            Influence<span className="text-orange-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link
            href="/marketplace"
            className="hover:text-orange-600 transition-colors"
          >
            Marketplace
          </Link>
          <Link
            href="/about"
            className="hover:text-orange-600 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-orange-600 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-medium hover:bg-stone-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-stone-700">
                  {user.name.split(" ")[0]}
                </span>
                <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md">
                  {user.role}
                </span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    onClick={() => setDropOpen(false)}
                  >
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    onClick={() => setDropOpen(false)}
                  >
                    <User size={14} /> Profile
                  </Link>
                  <hr className="my-1 border-stone-100" />
                  <button
                    onClick={() => {
                      logout();
                      setDropOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-stone-600 hover:text-ink transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-700 transition-all shadow-sm shadow-orange-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-stone-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-4 space-y-3">
          <Link
            href="/marketplace"
            className="block py-2 text-stone-700 font-medium"
            onClick={() => setOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            href="/register?role=influencer"
            className="block py-2 text-stone-700 font-medium"
            onClick={() => setOpen(false)}
          >
            For Creators
          </Link>
          <Link
            href="/register?role=brand"
            className="block py-2 text-stone-700 font-medium"
            onClick={() => setOpen(false)}
          >
            For Brands
          </Link>
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="block py-2 text-orange-600 font-medium"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="block py-2 text-red-600 font-medium w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block py-2 text-stone-700 font-medium"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="block bg-orange-600 text-white text-center py-2.5 rounded-xl font-semibold"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
