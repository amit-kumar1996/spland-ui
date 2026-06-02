import { useState } from "react";
import { Info, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const DISMISS_KEY = "spland_banner_dismissed";

export default function Banner() {
  const { user } = useAuth();

  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1"
  );

  if (dismissed) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="flex items-center gap-2.5 border-b border-line bg-tag px-4 py-2.5 text-[12.5px] text-accent">
      <Info size={15} className="shrink-0" />

      <span className="flex-1">
        {user ? (
          <>
            <b className="font-semibold">You're signed in</b> — you can now
            post comments. Welcome to Spland!
          </>
        ) : (
          <>
            <b className="font-semibold">Everything is free to browse</b> —
            view projects, read blogs, and read all comments. Sign up only when
            you want to post a comment.
          </>
        )}
      </span>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="opacity-60 hover:opacity-100"
      >
        <X size={15} />
      </button>
    </div>
  );
}