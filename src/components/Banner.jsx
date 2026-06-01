import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {Info, X} from "lucide-react";

const DISMISS_KEY = "spland_banner_dismissed";

export default function Banner() {
    const { user } = useAuth();
    const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === "1");

    function dismiss() {
        localStorage.setItem(DISMISS_KEY, "1");
        setDismissed(true);
    }

    return (
        <div className="banner">
            <Info size={15} aria-hidden="true" />
            <span className="b-text">
                {user ? (
                    <>
                        <b>You're signed in </b> - you can now post comments. Welcome to Spland!
                    </>
                ) : (
                    <>
                        <b>Everything is free to browse</b> - view projects, read blogs, and read all comments. Sign up only when you want to post a comment.
                    </>
                )}
            </span>
            <button className="banner-x" onClick={dismiss} aria-label="Dismiss">
                <X size={15} />
            </button>
        </div>
    );
}