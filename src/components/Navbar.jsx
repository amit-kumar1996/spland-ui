const { useState, useEffect, useRef } = require("react");
const { useAuth } = require("../context/AuthContext");
import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Palette, LogOut, Sun, Flame } from "lucide-react";
import AuthModal from "./AuthModal";

const TABS = [
    { label: "About", to: "/", end: true },
    { label: "Projects", to: "/projects" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
];

function initials(name = "") {
    return name.replace(/[^a-zA-Z ]/g, "")
    .trim()
    .split(/[ _]/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";
}

export default function Navbar() {
    const { user, login, logout } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem("spland_theme") || "light");
    const [authTab, setAuthTab] = useState("login");
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        document.body.classList.toggle("theme-warm", theme === "warm");
        localStorage.setItem("spland_theme", theme);
    }, [theme]);

    useEffect(() => {
        function onClick(e) {
            if(menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    function openAuth(tab) {
        setAuthTab(tab);
        setAuthOpen(true);
    }

    return (
        <>
            <nav className="nav">
                <Link to="/" className="logo" title="Home">
                    <span className="mark">S</span>
                    <b>sp<span>land</span></b>
                </Link>

                <div className="nav-tabs">
                    {TABS.map((tab) => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            end={tab.end}
                            className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </div>

                <div className="nav-right">
                    { user ? (
                        <div className="profile-wrap" ref={menuRef}>
                            <button className="mini-profile show" onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen((o) => !o);
                            }}>
                                <span className="mini-name">{user.displayName || user.username}</span>
                                <span className="mini-av">{initials(user.displayName || user.username)}</span>
                            </button>
                            
                            {menuOpen && (
                                <div className="profile-menu open">
                                    <div className="profile-head">
                                        <div className="pavatar">{initials(user.displayName || user.username)}</div>
                                        <div>
                                            <div className="pname">{user.displayName || user.username}</div>
                                            <div className="phandle">@{user.username}</div>
                                        </div>
                                    </div>

                                    {user.role === "owner" && (
                                        <Link to='/dashboard' className="menu-item" onClick={() => setMenuOpen(false)}>
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

                                    <button className="menu-item" style={{ color: "var(--accent)"}} onClick={() => { 
                                        logout(); 
                                        setMenuOpen(false); 
                                        }}>
                                        <LogOut size={17} />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : <button className="btn-auth" onClick={() => openAuth("login")}>Log in / Sign up</button>}
                </div>
            </nav>

            {authOpen && <AuthModal initialTab={authTab} onClose={() => setAuthOpen(false)} onSuccess={(payload) => {
                login(payload);
                setAuthOpen(false);
            }} />}
        </>
    );
}