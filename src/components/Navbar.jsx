import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Palette,
  LogOut,
  Sun,
  Flame,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "./AuthModal.jsx";

const TABS = [
  { to: "/", label: "About", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const tabClass = ({ isActive }) =>
  "rounded-full px-4 py-1.5 text-[13px] font-medium no-underline transition-colors " +
  (isActive
    ? "bg-surface text-ink shadow-sm"
    : "text-muted hover:text-ink");

const menuItem =
  "flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-[13px] text-ink no-underline hover:bg-tag text-left";

function initials(name = "") {
  return (
    name
      .replace(/[^a-zA-Z ]/g, "")
      .trim()
      .split(/\s+/)
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

export default function Navbar() {
  const { user, login, logout } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("spland_theme") || "light"
  );

  const menuRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("theme-warm", theme === "warm");
    localStorage.setItem("spland_theme", theme);
  }, [theme]);

  useEffect(() => {
    function onClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", onClick);

    return () =>
      document.removeEventListener("click", onClick);
  }, []);

  function openAuth(tab) {
    setAuthTab(tab);
    setAuthOpen(true);
  }

  const name = user
    ? user.displayName || user.username
    : "";

  const ini = initials(name);

  return (
    <>
      <nav className="sticky top-0 z-[100] flex h-[60px] items-center justify-between border-b border-line bg-canvas/90 px-6 backdrop-blur-md">
        <Link
          to="/"
          title="Home"
          className="flex items-center gap-2 font-display text-[21px] font-extrabold tracking-tight text-accent no-underline hover:opacity-75"
        >
          <span className="brand-gradient flex h-[30px] w-[30px] items-center justify-center rounded-[9px] text-[15px] font-extrabold text-white">
            S
          </span>

          <b>
            sp<span className="text-gold">land</span>
          </b>
        </Link>

        <div className="flex gap-0.5 rounded-full bg-black/[0.04] p-1">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={tabClass}
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div
              className="relative"
              ref={menuRef}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="flex items-center gap-2 border-none bg-transparent cursor-pointer"
              >
                <span className="text-[13px] font-medium text-ink">
                  {name}
                </span>

                <span className="brand-gradient flex h-[34px] w-[34px] items-center justify-center rounded-full font-display text-[12px] font-bold text-white">
                  {ini}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 z-[150] w-[224px] rounded-[14px] border border-line bg-surface p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
                  <div className="mb-1 flex items-center gap-2.5 border-b border-line p-2.5">
                    <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-full font-display text-[14px] font-bold text-white">
                      {ini}
                    </div>

                    <div className="min-w-0">
                      <div className="text-[14px] font-medium">
                        {name}
                      </div>

                      <div className="text-[12px] text-muted">
                        @{user.username}
                      </div>
                    </div>
                  </div>

                  {user.role === "owner" && (
                    <Link
                      to="/dashboard"
                      className={menuItem}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      <LayoutDashboard
                        size={17}
                        className="text-muted"
                      />
                      Dashboard
                    </Link>
                  )}

                  <div className="flex items-center justify-between px-2.5 py-2.5 text-[13px]">
                    <span className="flex items-center gap-2.5">
                      <Palette
                        size={17}
                        className="text-muted"
                      />
                      Theme
                    </span>

                    <div className="flex gap-[3px] rounded-full bg-black/[0.05] p-[3px]">
                      <button
                        onClick={() =>
                          setTheme("light")
                        }
                        title="Light"
                        className={
                          "flex h-6 w-7 items-center justify-center rounded-full " +
                          (theme === "light"
                            ? "bg-surface text-accent shadow-sm"
                            : "text-muted")
                        }
                      >
                        <Sun size={14} />
                      </button>

                      <button
                        onClick={() =>
                          setTheme("warm")
                        }
                        title="Warm"
                        className={
                          "flex h-6 w-7 items-center justify-center rounded-full " +
                          (theme === "warm"
                            ? "bg-surface text-accent shadow-sm"
                            : "text-muted")
                        }
                      >
                        <Flame size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    className={
                      menuItem + " text-accent"
                    }
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() =>
                openAuth("login")
              }
              className="cursor-pointer rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white hover:opacity-88"
            >
              Log in / Sign up
            </button>
          )}
        </div>
      </nav>

      {authOpen && (
        <AuthModal
          initialTab={authTab}
          onClose={() =>
            setAuthOpen(false)
          }
          onSuccess={(payload) => {
            login(payload);
            setAuthOpen(false);
          }}
        />
      )}
    </>
  );
}