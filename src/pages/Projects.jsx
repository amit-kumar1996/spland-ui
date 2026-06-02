import { useEffect, useState } from "react";
import {
  ExternalLink,
  FileText,
  MessageCircle,
} from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { FaGithub } from "react-icons/fa"
import CommentsModal from "../components/CommentsModal.jsx";
import AuthModal from "../components/AuthModal.jsx";

const link =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-accent px-3 py-1 text-[12px] font-medium text-accent no-underline hover:bg-accent hover:text-white";

const linkLive =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-accent bg-accent px-3 py-1 text-[12px] font-medium text-white no-underline hover:opacity-90";

const cbtn =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-muted hover:border-accent hover:text-accent";

const tag =
  "rounded-full bg-tag px-[9px] py-[3px] text-[11px] font-medium text-accent";

export default function Projects() {
  const { login } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
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
    <div className="mx-auto max-w-[720px] px-6 py-9">
      <div className="mb-1 font-display text-[24px] font-extrabold tracking-tight">
        Live Projects
      </div>

      <div className="mb-6 text-[14px] text-muted">
        Things I've shipped — view freely,
        comment after signing up.
      </div>

      {loading && (
        <div className="text-[14px] text-muted">
          Loading projects...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-[16px] border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
          >
            {p.emoji && (
              <div className="mb-2.5 text-[26px]">
                {p.emoji}
              </div>
            )}

            <div className="mb-1.5 font-display text-[15px] font-bold">
              {p.title}
            </div>

            <div className="mb-3 text-[13px] leading-relaxed text-muted">
              {p.description}
            </div>

            {p.tags?.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className={tag}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {p.liveUrl && (
                <a
                  className={linkLive}
                  href={p.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={13} />
                  Live
                </a>
              )}

              {p.githubUrl && (
                <a
                  className={link}
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub size={13} />
                  GitHub
                </a>
              )}

              {p.docsUrl && (
                <a
                  className={link}
                  href={p.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={13} />
                  Docs
                </a>
              )}

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