import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Lock,
} from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "../components/AuthModal.jsx";

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

export default function BlogRead() {
  const { slug } = useParams();
  const { user, login } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [progress, setProgress] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .blogBySlug(slug)
      .then((p) => {
        if (!active) return;
        setPost(p);
        return api.comments("blog", p.id);
      })
      .then((r) => active && r && setComments(r.comments))
      .catch(() => active && setNotFound(true));

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    function onScroll() {
      const max =
        document.documentElement.scrollHeight -
        window.innerHeight;

      setProgress(
        max > 0 ? (window.scrollY / max) * 100 : 0
      );
    }

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    onScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, [post]);

  const refresh = useCallback(async () => {
    if (!post) return;

    const r = await api.comments(
      "blog",
      post.id
    );

    setComments(r.comments);
  }, [post]);

  async function postComment() {
    if (!draft.trim()) return;

    await api.addComment(
      "blog",
      post.id,
      draft.trim()
    );

    setDraft("");
    refresh();
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-9">
        <div className="mb-1 font-display text-[24px] font-extrabold tracking-tight">
          Post not found
        </div>

        <Link
          className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent px-3.5 py-1.5 text-[12px] font-medium text-white no-underline"
          to="/blog"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-9 text-[14px] text-muted">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[200] h-[3px] bg-gold transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />

      <div className="flex h-[52px] items-center border-b border-line bg-canvas/90 px-5 backdrop-blur-md">
        <Link
          className="flex items-center gap-1.5 text-[13px] font-medium text-accent no-underline"
          to="/blog"
        >
          <ArrowLeft size={16} />
          Back to blog
        </Link>
      </div>

      <div className="mx-auto max-w-[600px] px-6 pb-4 pt-8">
        {post.emoji && (
          <div className="text-[40px]">
            {post.emoji}
          </div>
        )}

        <div className="mb-1 mt-3 text-[11.5px] font-semibold uppercase tracking-[0.5px] text-gold">
          {post.meta}
        </div>

        <h1 className="mb-1.5 font-display text-[27px] font-extrabold leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="mb-6 flex items-center gap-2 text-[12.5px] text-muted">
          <span className="brand-gradient flex h-[26px] w-[26px] items-center justify-center rounded-full font-display text-[11px] font-bold text-white">
            {initials(
              post.authorName || "Your Name"
            )}
          </span>

          {post.authorName || "Your Name"} ·{" "}
          {post.authorTitle ||
            "Senior Software Engineer"}
        </div>

        {(post.body || []).map((para, i) => (
          <p
            key={i}
            className="mb-[1.1rem] text-[15px] leading-[1.85]"
          >
            {para}
          </p>
        ))}
      </div>

      <div className="mx-auto max-w-[600px] px-6 pb-12 pt-6">
        <div className="mb-5 flex items-center gap-2 border-t border-line pt-6 font-display text-[17px] font-bold">
          <MessageSquare size={18} />
          Comments{" "}
          <span className="text-[14px] font-normal text-muted">
            ({comments.length})
          </span>
        </div>

        <div>
          {comments.length === 0 && (
            <div className="py-6 text-center text-[13px] text-muted">
              No comments yet. Be the first to share
              your thoughts.
            </div>
          )}

          {comments.map((c) => (
            <div
              key={c.id}
              className="mb-4 flex gap-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[12px] font-bold text-white">
                {initials(
                  c.display_name || c.username
                )}
              </div>

              <div>
                <div className="text-[13px] font-medium">
                  {c.display_name || c.username}{" "}
                  <span className="text-[11px] font-normal text-muted">
                    ·{" "}
                    {new Date(
                      c.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-[3px] text-[13px] leading-relaxed">
                  {c.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          {user ? (
            <div className="flex gap-2.5">
              <textarea
                value={draft}
                onChange={(e) =>
                  setDraft(e.target.value)
                }
                placeholder="Add a comment..."
                className="min-h-[44px] flex-1 resize-none rounded-[12px] border border-line bg-surface px-3 py-2.5 text-[13px] text-ink outline-none focus:border-accent"
              />

              <button
                onClick={postComment}
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
                onClick={() =>
                  setAuthOpen(true)
                }
                className="ml-auto cursor-pointer rounded-full bg-accent px-3.5 py-1.5 text-[12.5px] font-medium text-white"
              >
                Sign up to post
              </button>
            </div>
          )}
        </div>
      </div>

      {authOpen && (
        <AuthModal
          initialTab="signup"
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