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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const canAccess = (roles) => roles.includes(user?.role);

  const visibleNavItems = NAV_ITEMS.filter((item) => canAccess(item.roles));
  const visibleAdminItems = ADMIN_ITEMS.filter((item) => canAccess(item.roles));

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      {/* ===================== */}
      {/* Desktop */}
      {/* ===================== */}
      <div className="hidden md:block">
        {/* Top */}
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
              </svg>
            </div>

            <span className="font-bold text-gray-900">SCI Match Making</span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            {user && (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  user.role === "admin"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.role}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 transition"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {visibleAdminItems.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  Admin
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-3 h-3 transition ${
                      adminOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {adminOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 rounded-xl border bg-white shadow-lg overflow-hidden">
                    {visibleAdminItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setAdminOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm ${
                            isActive
                              ? "bg-rose-50 text-rose-600"
                              : "hover:bg-gray-50 text-gray-600"
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
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* Mobile */}
      {/* ===================== */}
      <div className="md:hidden">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
              </svg>
            </div>

            <span className="font-bold text-gray-900 text-sm">
              SCI Match Making
            </span>
          </div>

          {/* Member */}
          {!isAdmin && (
            <nav className="flex items-center gap-1">
              {visibleNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-rose-50 text-rose-600"
                        : "text-gray-500 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
              >
                Keluar
              </button>
            </nav>
          )}

          {/* Admin */}
          {isAdmin && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Admin Menu */}
        {isAdmin && mobileOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="px-3 py-3 space-y-1">
              {visibleNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm ${
                      isActive
                        ? "bg-rose-50 text-rose-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="border-t my-2" />

              {visibleAdminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm ${
                      isActive
                        ? "bg-rose-50 text-rose-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="border-t my-2" />

              {user && (
                <div className="px-3 py-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      user.role === "admin"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
              >
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
