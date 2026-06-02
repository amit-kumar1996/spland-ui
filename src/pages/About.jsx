import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Folder
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { api } from "../api/client.js";

const FALLBACK = {
  name: "Your Name",
  title: "Senior Software Engineer · Full-Stack",
  initials: "YN",
  pitch:
    "I design and scale web products end-to-end. Welcome to Spland — my special land on the internet.",
  available: true,
  availableText:
    "Available for freelance & full-time roles",
  links: {
    github: "#",
    linkedin: "#",
  },
  stats: [
    {
      num: "6+",
      label: "Years experience",
    },
    {
      num: "24",
      label: "Projects shipped",
    },
    {
      num: "100k+",
      label: "Users served",
    },
  ],
  experience: [],
  education: [],
  skills: [],
};

const ctaBase =
  "inline-flex cursor-pointer items-center gap-[7px] rounded-full px-4 py-[9px] text-[13px] font-medium no-underline";

const tag =
  "rounded-full bg-tag px-[9px] py-[3px] text-[11px] font-medium text-accent";

export default function About() {
  const [profile, setProfile] =
    useState(FALLBACK);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    api
      .profile()
      .then((p) =>
        setProfile({
          ...FALLBACK,
          ...p,
        })
      )
      .catch(() =>
        setProfile(FALLBACK)
      )
      .finally(() =>
        setLoading(false)
      );
  }, []);

  const p = profile;

  return (
    <div className="mx-auto max-w-[720px] px-6 py-9">
      <div className="mb-4 rounded-[18px] border border-line bg-surface p-[1.6rem]">
        <div className="flex items-start gap-5">
          <div className="brand-gradient flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[20px] font-display text-[24px] font-extrabold text-white">
            {p.initials}
          </div>

          <div className="flex-1">
            <div className="font-display text-[24px] font-extrabold leading-[1.1] tracking-tight">
              {p.name}
            </div>

            <div className="mt-[3px] text-[14px] font-medium text-accent">
              {p.title}
            </div>

            <div
              className="mt-2.5 text-[13.5px] leading-relaxed text-muted"
              dangerouslySetInnerHTML={{
                __html: p.pitch,
              }}
            />

            {p.available && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#E9F3EC] px-3 py-1 text-[11.5px] font-medium text-[#1F6B36]">
                <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#2EAA55]" />
                {p.availableText}
              </div>
            )}
          </div>
        </div>

        <div className="mt-[1.1rem] flex flex-wrap gap-2">
          <a
            className={
              ctaBase +
              " border border-accent bg-accent text-white hover:opacity-90"
            }
            href={api.resumeUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <Download size={15} />
            Download Resume
          </a>

          <Link
            className={
              ctaBase +
              " border border-accent bg-transparent text-accent hover:bg-accent hover:text-white"
            }
            to="/projects"
          >
            <Folder size={15} />
            View Projects
          </Link>

          <a
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line text-accent hover:bg-tag"
            href={p.links.github}
            aria-label="GitHub"
          >
            <FaGithub size={16} />
          </a>

          <a
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line text-accent hover:bg-tag"
            href={p.links.linkedin}
            aria-label="LinkedIn"
          >
            <FaLinkedin size={16} />
          </a>
        </div>

        {p.stats?.length > 0 && (
          <div className="mt-5 flex border-t border-line pt-4">
            {p.stats.map((s, i) => (
              <div
                key={i}
                className="flex-1 border-r border-line text-center last:border-r-0"
              >
                <div className="font-display text-[20px] font-extrabold text-accent">
                  {s.num}
                </div>

                <div className="mt-0.5 text-[11px] text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {p.experience?.length > 0 && (
        <div className="mb-4 rounded-[16px] border border-line bg-surface p-6">
          <div className="mb-4 font-display text-[11px] font-bold uppercase tracking-[2px] text-gold">
            Experience
          </div>

          {p.experience.map((e, i) => (
            <div
              key={i}
              className="mb-[1.1rem] flex gap-4 last:mb-0"
            >
              <span
                className={
                  "mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full " +
                  (i % 2
                    ? "bg-gold"
                    : "bg-accent")
                }
              />

              <div>
                <div className="text-[14px] font-medium">
                  {e.role}
                  {e.company
                    ? ` · ${e.company}`
                    : ""}
                </div>

                {e.date && (
                  <div className="mt-0.5 text-[12px] text-gold">
                    {e.date}
                  </div>
                )}

                {e.impact && (
                  <div className="mt-1 text-[12.5px] leading-relaxed text-muted">
                    {e.impact}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {p.education?.length > 0 && (
        <div className="mb-4 rounded-[16px] border border-line bg-surface p-6">
          <div className="mb-4 font-display text-[11px] font-bold uppercase tracking-[2px] text-gold">
            Education
          </div>

          {p.education.map((ed, i) => (
            <div
              key={i}
              className="mb-[1.1rem] flex gap-4 last:mb-0"
            >
              <span className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />

              <div>
                <div className="text-[14px] font-medium">
                  {ed.degree}
                </div>

                <div className="text-[13px] text-muted">
                  {ed.school}
                </div>

                {ed.date && (
                  <div className="mt-0.5 text-[12px] text-gold">
                    {ed.date}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {p.skills?.length > 0 && (
        <div className="rounded-[16px] border border-line bg-surface p-6">
          <div className="mb-4 font-display text-[11px] font-bold uppercase tracking-[2px] text-gold">
            Core Skills
          </div>

          <div className="flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <span
                key={s}
                className={tag}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-[14px] text-muted">
          Loading profile...
        </div>
      )}
    </div>
  );
}