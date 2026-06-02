import { useState } from "react";
import { X, Lock, Mail } from "lucide-react";
import { api } from "../api/client.js";

const ERRORS = {
    bad_credentials: "Incorrect email or password.",
    bad_code: "That code is wrong or expired.",
    email_taken: "An account with this email already exists.",
    username_taken: "That username is taken.",
    username_email_required: "Username and email are required.",
    no_user: "No account found for this email. Try signing up.",
};

const msg = (e) =>
    ERRORS[e?.message] ||
    "Something went wrong. Please try again.";

const labelCls =
    "mb-1 block text-[12px] font-medium text-muted";

const inputCls =
    "w-full rounded-[10px] border border-line bg-surface px-[11px] py-[9px] text-[13px] outline-none focus:border-accent disabled:bg-tag disabled:text-muted";

const submitCls =
    "mt-1 w-full cursor-pointer rounded-full bg-accent py-[11px] text-[14px] font-medium text-white hover:opacity-90 disabled:opacity-60";

const noteCls =
    "mt-[0.8rem] text-center text-[11.5px] leading-relaxed text-muted";

const linkCls =
    "cursor-pointer font-medium text-accent";

const fieldCls = "mb-[0.7rem]";

const req = (
    <span className="text-[#C0392B]">*</span>
);

function methodBtn(active) {
    return (
        "flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border py-[7px] text-[12px] font-medium cursor-pointer " +
        (active
            ? "border-accent bg-tag text-accent"
            : "border-line bg-surface text-muted")
    );
}

function segBtn(active) {
    return (
        "flex-1 rounded-full py-[7px] text-[13px] font-medium cursor-pointer border-none bg-transparent " +
        (active
            ? "bg-surface text-ink shadow-sm"
            : "text-muted")
    );
}

export default function AuthModal({
    initialTab = "login",
    onClose,
    onSuccess,
}) {
    const [tab, setTab] = useState(initialTab);

    const [loginMethod, setLoginMethod] =
        useState("pw");

    const [signupMethod, setSignupMethod] =
        useState("pw");

    const [otpSent, setOtpSent] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loginEmail, setLoginEmail] =
        useState("");

    const [loginPassword, setLoginPassword] =
        useState("");

    const [loginCode, setLoginCode] =
        useState("");

    const [suUsername, setSuUsername] =
        useState("");

    const [suEmail, setSuEmail] =
        useState("");

    const [suDisplay, setSuDisplay] =
        useState("");

    const [suPassword, setSuPassword] =
        useState("");

    const [suCode, setSuCode] =
        useState("");

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
        } finally {
            setLoading(false);
        }
    }

    const doLoginPassword = () =>
        run(async () =>
            onSuccess(
                await api.loginPassword(
                    loginEmail,
                    loginPassword
                )
            )
        );

    const sendLoginOtp = () =>
        run(async () => {
            await api.requestOtp(
                loginEmail,
                "login"
            );
            setOtpSent(true);
        });

    const doLoginOtp = () =>
        run(async () =>
            onSuccess(
                await api.loginOtp(
                    loginEmail,
                    loginCode
                )
            )
        );

    const sendSignupOtp = () =>
        run(async () => {
            if (!suUsername || !suEmail)
                throw new Error(
                    "username_email_required"
                );

            await api.requestOtp(
                suEmail,
                "signup"
            );

            setOtpSent(true);
        });

    const doSignup = () =>
        run(async () =>
            onSuccess(
                await api.signup({
                    username: suUsername,
                    email: suEmail,
                    displayName:
                        suDisplay || undefined,
                    password:
                        signupMethod === "pw"
                            ? suPassword
                            : undefined,
                    code: suCode,
                })
            )
        );

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(31,36,33,0.45)] p-4"
            onClick={onClose}
        >
            <div
                className="relative max-h-[92vh] w-[340px] max-w-full overflow-y-auto rounded-[18px] bg-surface p-6"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3.5 top-3.5 text-muted"
                >
                    <X size={18} />
                </button>

                <div className="mb-1 flex items-center gap-2 font-display text-[18px] font-extrabold text-accent">
                    <span className="brand-gradient flex h-[26px] w-[26px] items-center justify-center rounded-[8px] text-[13px] text-white">
                        S
                    </span>
                    spland
                </div>
                <div className="mb-4 text-[12.5px] text-muted">
                    {tab === "login" ? "Log in to post comments." : "Create an account to join the discussion."}
                </div>

                <div className="mb-[1.1rem] flex rounded-full bg-black/[0.05] p-[3px]">
                    <button className={segBtn(tab === "login")} onClick={() => switchTab("login")}>Log in</button>
                    <button className={segBtn(tab === "signup")} onClick={() => switchTab("signup")}>Sign up</button>
                </div>

                {error && (
                    <div className="mb-[0.8rem] rounded-[10px] bg-[#FBECEC] px-3 py-2 text-[12.5px] text-[#9B2C2C">
                        {error}
                    </div>
                )}

                {/* ---------- LOGIN ---------- */}
                {tab === "login" && (
                    <div>
                        <div className="mb-[0.8rem] flex gap-1.5">
                            <button
                                className={methodBtn(loginMethod === "pw")}
                                onClick={() => {
                                    setLoginMethod("pw");
                                    setOtpSent(false);
                                }}
                            >
                                <Lock size={14} />
                                Password
                            </button>

                            <button
                                className={methodBtn(loginMethod === "otp")}
                                onClick={() => {
                                    setLoginMethod("otp");
                                    setOtpSent(false);
                                }}
                            >
                                <Mail size={14} />
                                Email OTP
                            </button>
                        </div>

                        <div className={fieldCls}>
                            <label className={labelCls}>
                                Email {req}
                            </label>

                            <input
                                type="email"
                                className={inputCls}
                                placeholder="you@email.com"
                                value={loginEmail}
                                onChange={(e) =>
                                    setLoginEmail(e.target.value)
                                }
                            />
                        </div>

                        {loginMethod === "pw" ? (
                            <>
                                <div className={fieldCls}>
                                    <label className={labelCls}>
                                        Password {req}
                                    </label>

                                    <input
                                        type="password"
                                        className={inputCls}
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={(e) =>
                                            setLoginPassword(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            doLoginPassword()
                                        }
                                    />
                                </div>

                                <button
                                    className={submitCls}
                                    onClick={doLoginPassword}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Logging in..."
                                        : "Log in"}
                                </button>
                            </>
                        ) : !otpSent ? (
                            <button
                                className={submitCls}
                                onClick={sendLoginOtp}
                                disabled={loading}
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send code to email"}
                            </button>
                        ) : (
                            <>
                                <div className={fieldCls}>
                                    <label className={labelCls}>
                                        Enter the 6-digit code
                                    </label>

                                    <input
                                        inputMode="numeric"
                                        maxLength={6}
                                        className={inputCls}
                                        placeholder="123456"
                                        value={loginCode}
                                        onChange={(e) =>
                                            setLoginCode(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            doLoginOtp()
                                        }
                                    />
                                </div>

                                <button
                                    className={submitCls}
                                    onClick={doLoginOtp}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Verifying..."
                                        : "Log in"}
                                </button>

                                <div className={noteCls}>
                                    Didn't get it?{" "}
                                    <span
                                        className={linkCls}
                                        onClick={sendLoginOtp}
                                    >
                                        Resend
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ---------- SIGNUP ---------- */}
                {tab === "signup" && (
                    <div>
                        <div className={fieldCls}>
                            <label className={labelCls}>
                                Username {req}
                            </label>

                            <input
                                className={inputCls}
                                placeholder="e.g. priya_dev"
                                value={suUsername}
                                onChange={(e) =>
                                    setSuUsername(e.target.value)
                                }
                                disabled={otpSent}
                            />
                        </div>

                        <div className={fieldCls}>
                            <label className={labelCls}>
                                Email {req}
                            </label>

                            <input
                                type="email"
                                className={inputCls}
                                placeholder="you@email.com"
                                value={suEmail}
                                onChange={(e) =>
                                    setSuEmail(e.target.value)
                                }
                                disabled={otpSent}
                            />
                        </div>

                        <div className={fieldCls}>
                            <label className={labelCls}>
                                Display name{" "}
                                <span className="font-normal text-muted">
                                    (optional)
                                </span>
                            </label>

                            <input
                                className={inputCls}
                                placeholder="Priya Rao"
                                value={suDisplay}
                                onChange={(e) =>
                                    setSuDisplay(e.target.value)
                                }
                                disabled={otpSent}
                            />
                        </div>

                        <div className="mb-[0.8rem] flex gap-1.5">
                            <button
                                className={methodBtn(
                                    signupMethod === "pw"
                                )}
                                onClick={() =>
                                    setSignupMethod("pw")
                                }
                                disabled={otpSent}
                            >
                                <Lock size={14} />
                                Set password
                            </button>

                            <button
                                className={methodBtn(
                                    signupMethod === "otp"
                                )}
                                onClick={() =>
                                    setSignupMethod("otp")
                                }
                                disabled={otpSent}
                            >
                                <Mail size={14} />
                                Passwordless
                            </button>
                        </div>

                        {signupMethod === "pw" &&
                            !otpSent && (
                                <div className={fieldCls}>
                                    <label className={labelCls}>
                                        Password {req}
                                    </label>

                                    <input
                                        type="password"
                                        className={inputCls}
                                        placeholder="At least 8 characters"
                                        value={suPassword}
                                        onChange={(e) =>
                                            setSuPassword(e.target.value)
                                        }
                                    />
                                </div>
                            )}

                        {!otpSent ? (
                            <button
                                className={submitCls}
                                onClick={sendSignupOtp}
                                disabled={loading}
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send verification code"}
                            </button>
                        ) : (
                            <>
                                <div className={fieldCls}>
                                    <label className={labelCls}>
                                        Enter the code sent to{" "}
                                        {suEmail}
                                    </label>

                                    <input
                                        inputMode="numeric"
                                        maxLength={6}
                                        className={inputCls}
                                        placeholder="123456"
                                        value={suCode}
                                        onChange={(e) =>
                                            setSuCode(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            doSignup()
                                        }
                                    />
                                </div>

                                <button
                                    className={submitCls}
                                    onClick={doSignup}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create account"}
                                </button>

                                <div className={noteCls}>
                                    Didn't get it?{" "}
                                    <span
                                        className={linkCls}
                                        onClick={sendSignupOtp}
                                    >
                                        Resend
                                    </span>
                                </div>
                            </>
                        )}

                        <div className={noteCls}>
                            By signing up you agree to the{" "}
                            <span className={linkCls}>
                                terms
                            </span>
                            .
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

