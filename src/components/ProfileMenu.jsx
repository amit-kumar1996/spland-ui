const { useState, useEffect, useRef } = require("react");
const { useAuth } = require("../context/AuthContext");
import { LayoutDashboard, Palette, LogOut, Sun, Flame } from "lucide-react";
import { Link } from "react-router-dom";

function initials(name = "") {
    return name.replace(/[^a-zA-Z ]/g, "")
        .trim()
        .split(/[ _]/)
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";
}

export default function ProfileMenu({ title }) {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem("spland_theme") || "light");
    const ref = useRef(null);

    useEffect(() => {
        document.body.classList.toggle("theme-warm", theme === "warm");
        localStorage.setItem("spland_theme", theme);
    }, [theme]);

    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
            document.addEventListener("click", onClick);
            return () => document.removeEventListener("click", onClick);
        }
    }, []);

    if (!user) return null;

    const name = user.displayName || user.username;
    const ini = initials(name);

    return (
        <div className="profile-wrap" ref={ref}>
            <button className="profile-btn" onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v)
            }} aria-label="Profile menu">
                {ini}
            </button>

            {open && (
                <div className="profile-menu open">
                    <div className="profile-head">
                        <div className="pavatar">{ini}</div>
                        <div style={{ minWidth: 0 }}>
                            <div className="pname">{name}</div>
                            <div className="phandle">{title || `@${user.username}`}</div>
                        </div>
                    </div>

                    {user.role === "owner" && (
                        <Link to="/dashboard" className="menu-item" onClick={() => setOpen(false)}>
                            <LayoutDashboard size={17} />
                            Dashboard
                        </Link>
                    )}

                    <div className="theme-row">
                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Palette size={17} />
                            Theme
                        </span>
                        <div className="theme-toggle">
                            <button className={`theme-opt ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")} title="Light">
                                <Sun size={14} />
                            </button>
                            <button className={`theme-opt ${theme === "warm" ? "active" : ""}`} onClick={() => setTheme("warm")} title="Warm">
                                <Flame size={14} />
                            </button>
                        </div>
                    </div>

                    <button className="menu-item" style={{ color: "var(--accent)" }} onClick={() => {
                        logout();
                        setOpen(false);
                    }}>
                        <LogOut size={17} />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}