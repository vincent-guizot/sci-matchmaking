import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const NAV_ITEMS = [
  { to: "/", label: "Members", end: true, roles: ["admin", "member"] },
  { to: "/matchmaking", label: "Matchmaking", roles: ["admin", "member"] },
  { to: "/matches", label: "Matches", roles: ["admin"] },
  { to: "/participants-liked", label: "Participants Liked", roles: ["admin"] },
  { to: "/most-liked", label: "Most Liked", roles: ["admin"] },
];

const ADMIN_ITEMS = [
  { to: "/admin/add", label: "Tambah Peserta", roles: ["admin"] },
  { to: "/admin/list", label: "Daftar Admin", roles: ["admin"] },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [adminOpen, setAdminOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const canAccess = (roles) => roles.includes(user?.role);

  const visibleNavItems = NAV_ITEMS.filter((item) => canAccess(item.roles));
  const visibleAdminItems = ADMIN_ITEMS.filter((item) => canAccess(item.roles));

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center">
            <svg
              xmlns="[w3.org](http://www.w3.org/2000/svg)"
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-sm">SCI Match</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Admin dropdown — hanya muncul jika ada item yang bisa diakses */}
          {visibleAdminItems.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all flex items-center gap-1"
              >
                Admin
                <svg
                  xmlns="[w3.org](http://www.w3.org/2000/svg)"
                  className={`w-3 h-3 transition-transform ${adminOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {adminOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
                  {visibleAdminItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setAdminOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm transition ${
                          isActive
                            ? "text-rose-600 bg-rose-50"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User badge + Logout */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {user && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                user.role === "admin"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {user.role}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <svg
              xmlns="[w3.org](http://www.w3.org/2000/svg)"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
