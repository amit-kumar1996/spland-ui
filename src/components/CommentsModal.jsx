import { useEffect, useState } from "react";
import { X, Lock } from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

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

export default function CommentsModal({
  type,
  id,
  title,
  onClose,
  onCount,
  onRequestAuth,
}) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .comments(type, id)
      .then((r) => active && setComments(r.comments))
      .catch(() => {})
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [type, id]);

  async function post() {
    if (!draft.trim()) return;

    const { count } = await api.addComment(
      type,
      id,
      draft.trim()
    );

    setDraft("");

    const r = await api.comments(type, id);
    setComments(r.comments);

    onCount?.(count);
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(31,36,33,0.45)] p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[88vh] w-[380px] max-w-full flex-col rounded-[18px] bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 text-muted"
        >
          <X size={18} />
        </button>

        <div className="mb-0.5 pr-6 font-display text-[16px] font-bold">
          {title}
        </div>

        <div className="mb-4 text-[12px] text-muted">
          Everyone can read · sign up to post
        </div>

        <div className="mb-4 flex-1 overflow-y-auto">
          {loading && (
            <div className="py-6 text-center text-[13px] text-muted">
              Loading...
            </div>
          )}

          {!loading && comments.length === 0 && (
            <div className="py-6 text-center text-[13px] text-muted">
              No comments yet. Be the first to share your thoughts.
            </div>
          )}

          {comments.map((c) => (
            <div className="mb-4 flex gap-2.5" key={c.id}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[12px] font-bold text-white">
                {initials(c.display_name || c.username)}
              </div>

              <div>
                <div className="text-[13px] font-medium">
                  {c.display_name || c.username}{" "}
                  <span className="text-[11px] font-normal text-muted">
                    · {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-[3px] text-[13px] leading-relaxed">
                  {c.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line pt-4">
          {user ? (
            <div className="flex gap-2.5">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[44px] flex-1 resize-none rounded-[12px] border border-line bg-surface px-3 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
              />

              <button
                onClick={post}
                className="cursor-pointer rounded-[12px] bg-accent px-4 text-[13px] font-medium text-white"
              >
                Post
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-[12px] border border-line bg-tag px-3.5 py-3 text-[13px] text-accent">
              <Lock size={15} />
              Want to join in?

              <button
                onClick={onRequestAuth}
                className="ml-auto cursor-pointer rounded-full bg-accent px-3.5 py-1.5 text-[12.5px] font-medium text-white"
              >
                Sign up to post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}