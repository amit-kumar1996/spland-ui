import { useState } from "react";
import { X, Lock, Mail } from "lucide-react";
import { api } from "../api/client.js";

const ERRORS = {
    bad_credentials: "Incorrect email or password.",
    bad_code: "Invalid or expired code.",
    email_taken: "An account with this email already exists. Please log in or use a different email.",
    username_taken: "This username is already taken. Please choose a different username.",
    username_email_required: "Username and Email are required.",
    no_user: "No account found with this email. Try signing up.",
}

const msg = (e) => ERRORS[e?.message] || "Something went wrong. Please try again.";

export default function AuthModal({ initialTab = "login", onClose, onSuccess }) {
    const [tab, setTab] = useState(initialTab);
    const [loginMethod, setLoginMethod] = useState("pw");
    const [signupMethod, setSignupMethod] = useState("pw");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //form fields
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginCode, setLoginCode] = useState("");
    const [suEmail, setSuEmail] = useState("");
    const [suUsername, setSuUsername] = useState("");
    const [suPassword, setSuPassword] = useState("");
    const [suCode, setSuCode] = useState("");
    const [suDisplay, setSuDisplay] = useState("");

    function switchTab(next) {
        setTab(next);
        setError("");
        setOtpSent(false);
    }

    async function run(fn) {
        setLoading(true);
        setError("");
        try {
            await fn();
        } catch (e) {
            setError(msg(e));
        }
        finally {
            setLoading(false);
        }
    }

    const doLoginPassword = () => run(async () => {
        const res = await api.loginPassword(loginEmail, loginPassword);
        onSuccess(res);
    });

    const doLoginOtp = () => run(async () => {
        const res = await api.loginOtp(loginEmail, loginCode);
        onSuccess(res);
    });

    const doSignupOtp = () => run(async () => {
        if (!suUsername || !suEmail) throw new Error("username_email_required");
        await api.requestOtp(suEmail, "signup");
        setOtpSent(true);
    });

    const doSignupPassword = () => run(async () => {
        const res = await api.signup({ email: suEmail, username: suUsername, password: signupMethod === "pw" ? suPassword : undefined, displayName: suDisplay, code: suCode });
        onSuccess(res);
    });

    return (
        <div className="overlay open" onClick={onClose}>
            <div className="auth" onClick={(e) => e.stopPropagation()}>
                <button className="auth-x" onClick={onClose} aria-label="Close">
                    <X size={18} />
                </button>

                <div className="auth-logo">
                    <span className="mark">S</span> spland
                </div>

                <div className="auth-sub">
                    {tab === "login" ? "Welcome back! Please log in to your account." : "Join us today! Create an account to get started."}
                </div>

                <div className="seg">
                    <button className={tab === "login" ? "active" : ""} onClick={() => switchTab("login")}>Log in</button>
                    <button className={tab === "signup" ? "active" : ""} onClick={() => switchTab("signup")}>Sign up</button>
                </div>

                {error && <div style={{ background: "#FBECEC", color: "#9b2C2C", fontSize: 12.5, padding: "8px 12px", borderRadius: 10, marginBottom: "0.8rem" }}>{error}</div>}

                {/* --------Login form-------- */}
                {tab === "login" && (
                    <div>
                        <div className="method-toggle">
                            <button className={loginMethod === "pw" ? "active" : ""} onClick={() => {
                                setLoginMethod("pw")
                                setOtpSent(false);
                            }}>
                                <Lock size={14} /> Password
                            </button>
                            <button className={loginMethod === "otp" ? "active" : ""} onClick={() => {
                                setLoginMethod("otp")
                                setOtpSent(false);
                            }}>
                                <Mail size={14} /> Email OTP
                            </button>
                        </div>

                        <div className="field">
                            <label>Email <span className="req">*</span></label>
                            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Enter your email" />
                        </div>

                        {loginMethod === "pw" ? (
                            <>
                                <div className="field">
                                    <label>Password <span className="req">*</span></label>
                                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter your password" onKeyDown={(e) => e.key === "Enter" && doLoginPassword()} />
                                </div>
                                <button className="auth-submit" onClick={doLoginPassword} disabled={loading}>
                                    {loading ? "Logging in..." : "Log in"}
                                </button>
                            </>
                        ) : !otpSent ? (
                            <button className="auth-submit" onClick={sendLoginOtp} disabled={loading}>
                                {loading ? "Sending OTP..." : "Send code to email"}
                            </button>
                        ) : (
                            <>
                                <div className="field">
                                    <label>Email OTP <span className="req">*</span></label>
                                    <input inputMode="numeric" value={loginCode} maxLength={6} onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, ""))} placeholder="Enter the OTP sent to your email" onKeyDown={(e) => e.key === "Enter" && doLoginOtp()} />
                                </div>
                                <button className="auth-submit" onClick={doLoginOtp} disabled={loading}>
                                    {loading ? "Verifying..." : "Log in"}
                                </button>
                                <div className="auth-note">
                                    Didn't receive the code? <span className="auth-link" onClick={sendLoginOtp} disabled={loading}>Resend</span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* --------Signup form-------- */}
                {tab === "signup" && (
                    <div>
                        <div className="field">
                            <label>Username <span className="req">*</span></label>
                            <input type="text" value={suUsername} onChange={(e) => setSuUsername(e.target.value)} disabled={otpSent} placeholder="Enter your username" />
                        </div>
                        <div className="field">
                            <label>Email <span className="req">*</span></label>
                            <input type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} disabled={otpSent} placeholder="Enter your email" />
                        </div>
                        <div className="field">
                            <label>Display Name {" "}
                                <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span>
                            </label>
                            <input type="text" value={suDisplay} onChange={(e) => setSuDisplay(e.target.value)} disabled={otpSent} placeholder="Enter your display name (optional)" />
                        </div>

                        <div className="method-toggle">
                            <button className={signupMethod === "pw" ? "active" : ""} onClick={() => setSignupMethod("pw")} disabled={otpSent}>
                                <Lock size={14} /> Set Password
                            </button>
                            <button className={signupMethod === "otp" ? "active" : ""} onClick={() => setSignupMethod("otp")} disabled={otpSent}>
                                <Mail size={14} /> Passwordless (Email OTP)
                            </button>
                        </div>

                        {signupMethod === "pw" && !otpSent && (
                            <div className="field">
                                <label>Password <span className="req">*</span></label>
                                <input type="password" value={suPassword} onChange={(e) => setSuPassword(e.target.value)} placeholder="Create a password" />
                            </div>
                        )}

                        {!otpSent ? (
                            <button className="auth-submit" onClick={sendSignupOtp} disabled={loading}>
                                {loading ? "Sending OTP..." : "Sign up"}
                            </button>
                        ) : (
                            <>
                                <div className="field">
                                    <label>Email OTP <span className="req">*</span></label>
                                    <input inputMode="numeric" value={suCode} maxLength={6} onChange={(e) => setSuCode(e.target.value.replace(/\D/g, ""))} onKeyDown={(e) => e.key === "Enter" && doSignup()} placeholder="Enter the OTP sent to your email" />
                                </div>
                                <button className="auth-submit" onClick={doSignup} disabled={loading}>
                                    {loading ? "Creating account..." : "Complete Sign up"}
                                </button>
                                <div className="auth-note">
                                    Didn't receive the code? <span className="auth-link" onClick={sendSignupOtp}>Resend</span>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

