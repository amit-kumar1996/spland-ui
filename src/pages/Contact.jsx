import { useEffect, useState } from "react";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { api } from "../api/client.js";

const FALLBACK = {
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
      icon: <Linkedin size={16} />,
      label: "LINKEDIN",
      value: c.linkedin,
      href: `https://${c.linkedin}`,
    },
    {
      icon: <Github size={16} />,
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
    <div className="page active">
      <div className="section-heading">Let's connect</div>

      <div className="section-sub">
        Open to <b>new</b> opportunities, collaborations, and good
        conversations.
      </div>

      <div className="contact-card">
        {rows.map((r, i) => (
          <div className="contact-item" key={i}>
            <div className="contact-icon">{r.icon}</div>

            <div>
              <div className="contact-label">{r.label}</div>

              {r.href ? (
                <a
                  className="contact-value"
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.value}
                </a>
              ) : (
                <div
                  className="contact-value"
                  style={{ color: "var(--text)" }}
                >
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