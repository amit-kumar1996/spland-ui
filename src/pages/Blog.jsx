import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import CommentsModal from "../components/CommentsModal.jsx";
import AuthModal from "../components/AuthModal.jsx";

const readLink =
  "inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent px-3.5 py-1.5 text-[12px] font-medium text-white no-underline hover:opacity-90";

const cbtn =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-muted hover:border-accent hover:text-accent";

export default function Blog() {
  const { login } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    api
      .blog()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  function setCount(id, count) {
    setPosts((list) =>
      list.map((p) =>
        p.id === id
          ? { ...p, commentCount: count }
          : p
      )
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-6 py-9">
      <div className="mb-1 font-display text-[24px] font-extrabold tracking-tight">
        Notes &amp; Blog
      </div>

      <div className="mb-6 text-[14px] text-muted">
        Click Read to <strong>open</strong> the full
        post — comments live at the bottom{" "}
        <em>of</em> each article.
      </div>

      {loading && (
        <div className="text-[14px] text-muted">
          Loading posts...
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex items-start gap-4 rounded-[16px] border border-line bg-surface p-5"
          >
            {p.emoji && (
              <div className="shrink-0 text-[30px] leading-none">
                {p.emoji}
              </div>
            )}

            <div className="flex-1">
              <div className="mb-1 text-[11px] font-semibold text-gold">
                {p.meta}
              </div>

              <div className="mb-1.5 font-display text-[15px] font-bold">
                {p.title}
              </div>

              <div className="text-[13px] leading-relaxed text-muted">
                {p.excerpt || p.description}
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <Link
                  className={readLink}
                  to={`/blog/${p.slug}`}
                >
                  <BookOpen size={14} />
                  Read
                </Link>

                <button
                  className={cbtn}
                  onClick={() =>
                    setTarget({
                      id: p.id,
                      title: p.title,
                    })
                  }
                >
                  <MessageCircle size={14} />
                  Comments {p.commentCount ?? 0}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {target && (
        <CommentsModal
          type="blog"
          id={target.id}
          title={target.title}
          onClose={() => setTarget(null)}
          onCount={(count) =>
            setCount(target.id, count)
          }
          onRequestAuth={() =>
            setAuthOpen(true)
          }
        />
      )}

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
    </div>
  );
}