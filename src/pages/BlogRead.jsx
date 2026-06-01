import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessagesSquare, Lock } from "lucide-react";
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

  // load the post, then its comments
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

  // reading progress based on window scroll
  useEffect(() => {
    function onScroll() {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [post]);

  const refresh = useCallback(async () => {
    if (!post) return;

    const r = await api.comments("blog", post.id);
    setComments(r.comments);
  }, [post]);

  async function postComment() {
    if (!draft.trim()) return;

    await api.addComment("blog", post.id, draft.trim());
    setDraft("");
    refresh();
  }

  if (notFound) {
    return (
      <div className="page active">
        <div className="section-heading">Post not found</div>

        <Link className="read-link" to="/blog">
          <ArrowLeft size={14} /> Back to blog
        </Link>
      </div>
    );
  }

  if (!post)
    return (
      <div className="page active">
        <div className="section-sub">Loading...</div>
      </div>
    );

  return (
    <>
      <div
        className="progress"
        style={{ width: `${progress}%` }}
      />

      <div className="read-bar">
        <Link className="back-btn" to="/blog">
          <ArrowLeft size={16} /> Back to blog
        </Link>
      </div>

      <div className="article">
        {post.emoji && (
          <div className="a-emoji">
            {post.emoji}
          </div>
        )}

        <div className="a-meta">{post.meta}</div>

        <h1>{post.title}</h1>

        <div className="a-author">
          <span className="aa">
            {initials(post.authorName || "Amit Kumar")}
          </span>

          {post.authorName || "Amit Kumar"} ·{" "}
          {post.authorTitle || "Assosciate - Projects"}
        </div>

        {(post.body || []).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="read-comments">
        <div className="rc-head">
          <MessagesSquare size={18} />
          {" "}Comments{" "}
          <span
            style={{
              color: "var(--muted)",
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            ({comments.length})
          </span>
        </div>

        <div>
          {comments.length === 0 && (
            <div className="cm-empty">
              No comments yet. Be the first to share your thoughts.
            </div>
          )}

          {comments.map((c) => (
            <div className="comment" key={c.id}>
              <div className="c-av">
                {initials(c.display_name || c.username)}
              </div>

              <div>
                <div className="c-name">
                  {c.display_name || c.username}{" "}
                  <span className="c-time">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="c-body">
                  {c.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1rem" }}>
          {user ? (
            <div className="post-box">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a comment..."
              />

              <button onClick={postComment}>
                Post
              </button>
            </div>
          ) : (
            <div className="post-prompt">
              <Lock size={15} /> Want to join in?

              <button
                className="pp-btn"
                onClick={() => setAuthOpen(true)}
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
          onClose={() => setAuthOpen(false)}
          onSuccess={(payload) => {
            login(payload);
            setAuthOpen(false);
          }}
        />
      )}
    </>
  );
}