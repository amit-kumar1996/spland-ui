import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { api } from "../api/client.js";

const FALLBACK = {
  available: true,
  availableText:
    "Available for freelance & full-time roles",
  contact: {
    email: "hello@spland.dev",
    linkedin: "linkedin.com/in/yourname",
    github: "github.com/yourhandle",
    location: "New Delhi, India",
  },
};

export default function Contact() {
  const [data, setData] = useState(FALLBACK);

  useEffect(() => {
    api
      .profile()
      .then((p) =>
        setData({
          ...FALLBACK,
          ...p,
          contact: {
            ...FALLBACK.contact,
            ...(p.contact || {}),
          },
        })
      )
      .catch(() => setData(FALLBACK));
  }, []);

  const c = data.contact;

  const rows = [
    {
      icon: <Mail size={16} />,
      label: "EMAIL",
      value: c.email,
      href: `mailto:${c.email}`,
    },
    {
      icon: <FaLinkedin size={16} />,
      label: "LINKEDIN",
      value: c.linkedin,
      href: `https://${c.linkedin}`,
    },
    {
      icon: <FaGithub size={16} />,
      label: "GITHUB",
      value: c.github,
      href: `https://${c.github}`,
    },
    {
      icon: <MapPin size={16} />,
      label: "LOCATION",
      value: c.location,
      href: null,
    },
  ];

  return (
    <div className="mx-auto max-w-[720px] px-6 py-9">
      <div className="mb-1 font-display text-[24px] font-extrabold tracking-tight">
        Let's connect
      </div>

      <div className="mb-6 text-[14px] text-muted">
        Open to new opportunities,
        collaborations, and good conversations.
      </div>

      {data.available && (
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#E9F3EC] px-3.5 py-1.5 text-[12px] font-medium text-[#1F6B36]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#2EAA55]" />
          {data.availableText}
        </div>
      )}

      <div className="rounded-[16px] border border-line bg-surface p-6">
        {rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-line py-3 text-[14px] last:border-b-0 last:pb-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-tag text-accent">
              {r.icon}
            </div>

            <div>
              <div className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.5px] text-muted">
                {r.label}
              </div>

              {r.href ? (
                <a
                  className="font-medium text-accent no-underline"
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.value}
                </a>
              ) : (
                <div className="font-medium text-ink">
                  {r.value}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}