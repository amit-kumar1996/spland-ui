import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Palette,
  LogOut,
  Sun,
  Flame,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const menuItem =
  "flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-[13px] text-ink no-underline hover:bg-tag text-left cursor-pointer border-none bg-transparent";

function initials(name = "") {
  return (
    name
      .replace(/[^a-zA-Z ]/g, "")
      .trim()
      .split(/[ _]/)
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

/**
 * Reusable profile dropdown for any logged-in user.
 * @param {string} [title] optional short title shown under the name
 *        (e.g. "Senior Software Engineer")
 */
export default function ProfileMenu({ title }) {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("spland_theme") || "light"
  );

  const ref = useRef(null);

  useEffect(() => {
    document.body.classList.toggle(
      "theme-warm",
      theme === "warm"
    );
    localStorage.setItem("spland_theme", theme);
  }, [theme]);

  useEffect(() => {
    function onClick(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("click", onClick);

    return () =>
      document.removeEventListener("click", onClick);
  }, []);

  if (!user) return null;

  const name = user.displayName || user.username;
  const ini = initials(name);

  const themeBtn = (active) =>
    "flex h-6 w-7 items-center justify-center rounded-full cursor-pointer border-none bg-transparent " +
    (active
      ? "bg-surface text-accent shadow-sm"
      : "text-muted");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Profile menu"
        className="brand-gradient flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-2 border-surface font-display text-[13px] font-bold text-white transition-transform hover:scale-105"
      >
        {ini}
      </button>

      {open && (
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
                {title || `@${user.username}`}
              </div>
            </div>
          </div>

          {user.role === "owner" && (
            <Link
              to="/dashboard"
              className={menuItem}
              onClick={() => setOpen(false)}
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
                onClick={() => setTheme("light")}
                title="Light"
                className={themeBtn(theme === "light")}
              >
                <Sun size={14} />
              </button>

              <button
                onClick={() => setTheme("warm")}
                title="Warm"
                className={themeBtn(theme === "warm")}
              >
                <Flame size={14} />
              </button>
            </div>
          </div>

          <button
            className={menuItem + " text-accent"}
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}