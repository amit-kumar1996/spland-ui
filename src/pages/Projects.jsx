import { useEffect, useState } from "react";
import {
  ExternalLink,
  Github,
  FileText,
  MessageCircle,
} from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import CommentsModal from "../components/CommentsModal.jsx";
import AuthModal from "../components/AuthModal.jsx";

export default function Projects() {
  const { login } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null); // { id, title }
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    api
      .projects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  function setCount(id, count) {
    setProjects((list) =>
      list.map((p) =>
        p.id === id
          ? { ...p, commentCount: count }
          : p
      )
    );
  }

  return (
    <div className="page active">
      <div className="section-heading">
        Live Projects
      </div>

      <div className="section-sub">
        Things I've shipped — view freely,
        comment after signing up.
      </div>

      {loading && (
        <div className="section-sub">
          Loading projects...
        </div>
      )}

      <div className="projects-grid">
        {projects.map((p) => (
          <div
            className="project-card"
            key={p.id}
          >
            {p.emoji && (
              <div className="project-emoji">
                {p.emoji}
              </div>
            )}

            <div className="project-title">
              {p.title}
            </div>

            <div className="project-desc">
              {p.description}
            </div>

            {p.tags?.length > 0 && (
              <div className="project-tags">
                {p.tags.map((t) => (
                  <span
                    className="project-tag"
                    key={t}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="project-links">
              {p.liveUrl && (
                <a
                  className="proj-link live"
                  href={p.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={13} />
                  {" "}Live
                </a>
              )}

              {p.githubUrl && (
                <a
                  className="proj-link"
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={13} />
                  {" "}GitHub
                </a>
              )}

              {p.docsUrl && (
                <a
                  className="proj-link"
                  href={p.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={13} />
                  {" "}Docs
                </a>
              )}

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
                {p.commentCount ?? 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      {target && (
        <CommentsModal
          type="project"
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