import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Folder, Github, Linkedin } from 'lucide-react';
import { api } from '../api/client';

const FALLBACK = {
    name: "Amit Kumar",
    title: "Assosciate - Projects",
    initials: "YN",
    pitch: "I design and scale web products end-to-end. Welcome to Spland - my special land on the internet",
    links: { github: "#", linkedin: "#" },
    stats: [
        { num: "6+", label: "Years experience" },
        { num: "24", label: "Projects shipped" },
        { num: "100k+", label: "Users served" }
    ],
    experience: [],
    education: [],
    skills: []
};

export default function About() {
    const [profile, setProfile] = useState(FALLBACK);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.profile()
        .then((p) => setProfile({ ...FALLBACK, ...p}))
        .catch(() => setProfile(FALLBACK))
        .finally(() => setLoading(false))
    }, [])

    const p = profile;

    return (
        <div className='page active'>
            <div className='hero'>
                <div className="hero-top">
                    <div className='avatar'>{p.initials}</div>
                    <div style={{ flex: 1}}>
                        <div className='hero-name'>{p.name}</div>
                        <div className='hero-title'>{p.title}</div>
                        <div className='helo-pitch' dangerouslySetInnerHTML={{ __html: p.pitch }} />
                    </div>
                </div>

                <div className='cta-row'>
                    <a className='cta primary' href={api.resumeUrl()} target="_blank" rel="noreferrer">
                        <Download size={15} /> Download Resume
                    </a>
                    <Link className='cta ghost' to="/projects">
                        <Folder size={15} /> View Projects
                    </Link>
                    <a className='cta icon' href={p.links.github} aria-label='GitHub'>
                        <Github size={16} />
                    </a>
                    <a className='cta icon' href={p.links.linkedin} aria-label="LinkedIn">
                        <Linkedin size={16} />
                    </a>
                </div>

                {p.stats?.length > 0 && (
                    <div className='stats'>
                        {p.stats.map((s, i) => (
                            <div className='stat' key={i}>
                                <div className='stat-num'>{s.num}</div>
                                <div className='stat-lbl'>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {p.experience?.length > 0 && (
                <div className='resume-section'>
                    <div className='section-label'>Experience</div>
                    {p.experience.map((e,i) => (
                        <div className='exp-item' key={i} style={i === p.experience.length - 1 ? {marginBottom: 0} : null}>
                            <div className='exp-dot' style={i % 2 ? { background: "var(--accent2)" } : null} />
                            <div>
                                <div className='exp-role'>
                                    {e.role}
                                    {e.company ? `.${e.company}` : ""}
                                </div>
                                {e.date && <div className='exp-date'>{e.date}</div>}
                                {e.impact && <div className='exp-impact'>{e.impact}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {p.education?.length > 0 && (
                <div className='resume-section'>
                    <div className='section-label'>Education</div>
                    {p.education.map((ed,i) => (
                        <div className='exp-item' key={i} style={i === p.education.length - 1 ? {marginBottom: 0} : null}>
                            <div className='exp-dot' style={{ background: "var(--accent2)" }} />
                            <div>
                                <div className='exp-role'>{ed.degree}</div>
                                <div className='exp-company'>{ed.school}</div>
                                {ed.date && <div className='exp-date'>{ed.date}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {p.skills?.length > 0 && (
                <div className='resume-section' style={{marginBottom: 0}}>
                    <div className='section-label'>Core Skills</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8}}>
                        {p.skills.map((s) => (
                            <span className='project-tag' key={s}>{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {loading && <div className='section-sub' style={{ marginTop: "1rem" }}>Loading profile...</div>}
        </div>
    )
}