import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, MessageCircle } from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import CommentsModal from "../components/CommentsModal.jsx";
import AuthModal from "../components/AuthModal.jsx";

export default function Blog() {
  const { login } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null); // { id, title }
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
        p.id === id ? { ...p, commentCount: count } : p
      )
    );
  }

  return (
    <div className="page active">
      <div className="section-heading">Notes &amp; Blog</div>

      <div className="section-sub">
        Click Read to <b>open</b> the full post — comments live at the bottom
        of each article.
      </div>

      {loading && (
        <div className="section-sub">
          Loading posts...
        </div>
      )}

      <div className="blog-list">
        {posts.map((p) => (
          <div className="blog-card" key={p.id}>
            {p.emoji && (
              <div className="blog-emoji">
                {p.emoji}
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div className="blog-meta">
                {p.meta}
              </div>

              <div className="project-title">
                {p.title}
              </div>

              <div className="project-desc">
                {p.excerpt || p.description}
              </div>

              <div className="blog-foot">
                <Link
                  className="read-link"
                  to={`/blog/${p.slug}`}
                >
                  <BookOpen size={14} /> Read
                </Link>

                <button
                  className="cbtn"
                  onClick={() =>
                    setTarget({
                      id: p.id,
                      title: p.title,
                    })
                  }
                >
                  <MessageCircle size={14} />
                  {" "}
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
          onCount={(count) => setCount(target.id, count)}
          onRequestAuth={() => setAuthOpen(true)}
        />
      )}

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
    </div>
  );
}