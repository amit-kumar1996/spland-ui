import { useEffect, useState } from "react";
import { Save, Trash2, Upload, Plus, FileText } from "lucide-react";
import { api } from "../api/client.js";
/* ---------- shared styles ---------- */
const card = "rounded-[16px] border border-line bg-surface p-5";
const label = "mb-1 block text-[12px] font-medium text-muted";
const input = "w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-[13px] text-ink outline-none focus:border-accent";
const inputSm = "min-w-[110px] flex-1 rounded-[8px] border border-line bg-surface px-2.5 py-1.5 text-[12px] text-ink outline-none focus:border-accent";
const btn = "inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60";
const btnGhost = "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-muted hover:border-accent hover:text-accent";
const iconBtn = "flex h-8 w-8 items-center justify-center rounded-[8px] border border-line text-muted hover:border-red-400 hover:text-red-500 cursor-pointer";
const field = "mb-3";
const ok = "text-[12px] font-medium text-accent";
/* ---------- generic repeatable rows (stats / experience / education) ---------- */
function Rows({ items, fields, onChange, addLabel }) {
    const update = (i, k, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
    const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, ""]))]);
    const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
    return (
        <div className="flex flex-col gap-2">
            {items.map((it, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line p-2">
                    {fields.map((f) => (
                        <input key={f.key} className={inputSm} placeholder={f.label} value={it[f.key] || ""}
                            onChange={(e) => update(i, f.key, e.target.value)} />
                    ))}
                    <button className={iconBtn} onClick={() => remove(i)} aria-label="Remove"><Trash2 size={14} /></button>
                </div>
            ))}
            <button className={btnGhost + " self-start"} onClick={add}><Plus size={13} /> {addLabel}</button>
        </div>
    );
}
/* ---------- Profile editor ---------- */
function ProfileEditor() {
    const [p, setP] = useState(null);
    const [msg, setMsg] = useState("");
    useEffect(() => {
        api.profile()
            .then((d) => setP(normalize(d || {})))
            .catch(() => setP(normalize({})));
    }, []);
    if (!p) return <div className="text-[13px] text-muted">Loading…</div>;
    const set = (k, v) => setP((s) => ({ ...s, [k]: v }));
    const setLink = (k, v) => setP((s) => ({ ...s, links: { ...s.links, [k]: v } }));
    async function save() {
        await api.saveProfile(p);
        setMsg("Saved");
        setTimeout(() => setMsg(""), 1800);
    }
    return (
        <div className={card}>
            <div className={field}><label className={label}>Initials (avatar)</label><input className={input} value={p.initials} onChange={(e) => set("initials", e.target.value)} /></div>
            <div className={field}><label className={label}>Name</label><input className={input} value={p.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div className={field}><label className={label}>Title</label><input className={input} value={p.title} onChange={(e) => set("title", e.target.value)} /></div>
            <div className={field}><label className={label}>Pitch (HTML allowed)</label><textarea className={input + " min-h-[70px]"} value={p.pitch} onChange={(e) => set("pitch", e.target.value)} /></div>
            <div className={field}>
                <label className="mb-1 flex items-center gap-2 text-[13px]">
                    <input type="checkbox" checked={p.available} onChange={(e) => set("available", e.target.checked)} /> Available for work
                </label>
                <input className={input} value={p.availableText} onChange={(e) => set("availableText", e.target.value)} />
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
                <div><label className={label}>GitHub URL</label><input className={input} value={p.links.github} onChange={(e) => setLink("github", e.target.value)} /></div>
                <div><label className={label}>LinkedIn URL</label><input className={input} value={p.links.linkedin} onChange={(e) => setLink("linkedin", e.target.value)} /></div>
            </div>
            <div className={field}><label className={label}>Stats</label>
                <Rows items={p.stats} fields={[{ key: "num", label: "Number" }, { key: "label", label: "Label" }]} onChange={(v) => set("stats", v)} addLabel="Add stat" />
            </div>
            <div className={field}><label className={label}>Experience</label>
                <Rows items={p.experience} fields={[{ key: "role", label: "Role" }, { key: "company", label: "Company" }, { key: "date", label: "Date" }, { key: "impact", label: "Impact" }]} onChange={(v) => set("experience", v)} addLabel="Add role" />
            </div>
            <div className={field}><label className={label}>Education</label>
                <Rows items={p.education} fields={[{ key: "degree", label: "Degree" }, { key: "school", label: "School" }, { key: "date", label: "Date" }]} onChange={(v) => set("education", v)} addLabel="Add education" />
            </div>
            <div className={field}><label className={label}>Skills (comma separated)</label>
                <input className={input} value={(p.skills || []).join(", ")} onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
            </div>
            <div className="mt-2 flex items-center gap-3">
                <button className={btn} onClick={save}><Save size={15} /> Save profile</button>
                {msg && <span className={ok}>{msg}</span>}
            </div>
        </div>
    );
}
function normalize(d) {
    return {
        initials: d.initials || "", name: d.name || "", title: d.title || "", pitch: d.pitch || "",
        available: d.available ?? true, availableText: d.availableText || "",
        links: { github: d.links?.github || "", linkedin: d.links?.linkedin || "" },
        stats: d.stats || [], experience: d.experience || [], education: d.education || [], skills: d.skills || [],
    };
}
/* ---------- Generic collection editor (projects + blog) ---------- */
function CollectionEditor({ load, create, update, remove, fields, titleKey }) {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(empty(fields));
    const [editingId, setEditingId] = useState(null);
    const [msg, setMsg] = useState("");
    const reload = () => load().then(setItems).catch(() => setItems([]));
    useEffect(() => { reload(); }, []);
    function edit(it) { setEditingId(it.id); setForm(toForm(it, fields)); window.scrollTo({ top: 0, behavior: "smooth" }); }
    function resetForm() { setEditingId(null); setForm(empty(fields)); }
    async function save() {
        const payload = fromForm(form, fields);
        if (editingId) await update(editingId, payload); else await create(payload);
        resetForm(); reload();
        setMsg("Saved"); setTimeout(() => setMsg(""), 1500);
    }
    async function del(id) { await remove(id); reload(); }
    return (
        <div className="flex flex-col gap-4">
            <div className={card}>
                <div className="mb-3 font-display text-[14px] font-bold">{editingId ? "Edit item" : "New item"}</div>
                {fields.map((f) => (
                    <div className={field} key={f.key}>
                        <label className={label}>{f.label}</label>
                        {f.type === "textarea" || f.type === "paragraphs" ? (
                            <textarea className={input + " min-h-[80px]"} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                        ) : f.type === "checkbox" ? (
                            <input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />
                        ) : (
                            <input className={input} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                        )}
                    </div>
                ))}
                <div className="flex items-center gap-3">
                    <button className={btn} onClick={save}><Save size={15} /> {editingId ? "Update" : "Create"}</button>
                    {editingId && <button className={btnGhost} onClick={resetForm}>Cancel</button>}
                    {msg && <span className={ok}>{msg}</span>}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 rounded-[12px] border border-line bg-surface p-3">
                        <span className="text-[18px]">{it.emoji}</span>
                        <span className="flex-1 text-[13px] font-medium">{it[titleKey]}</span>
                        <button className={btnGhost} onClick={() => edit(it)}>Edit</button>
                        <button className={iconBtn} onClick={() => del(it.id)} aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                ))}
                {items.length === 0 && <div className="text-[13px] text-muted">Nothing here yet — create your first one above.</div>}
            </div>
        </div>
    );
}
function empty(fields) {
    return Object.fromEntries(fields.map((f) => [f.key, f.type === "checkbox" ? false : ""]));
}
function toForm(item, fields) {
    const o = {};
    for (const f of fields) {
        if (f.type === "tags") o[f.key] = (item[f.key] || []).join(", ");
        else if (f.type === "paragraphs") o[f.key] = (item[f.key] || []).join("\n\n");
        else if (f.type === "checkbox") o[f.key] = !!item[f.key];
        else o[f.key] = item[f.key] || "";
    }
    return o;
}
function fromForm(form, fields) {
    const o = {};
    for (const f of fields) {
        if (f.type === "tags") o[f.key] = String(form[f.key]).split(",").map((s) => s.trim()).filter(Boolean);
        else if (f.type === "paragraphs") o[f.key] = String(form[f.key]).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
        else if (f.type === "checkbox") o[f.key] = !!form[f.key];
        else o[f.key] = form[f.key];
    }
    return o;
}
/* ---------- Resume uploader ---------- */
function ResumeUploader() {
    const [file, setFile] = useState(null);
    const [labelText, setLabelText] = useState("");
    const [msg, setMsg] = useState("");
    async function upload() {
        if (!file) return;
        await api.uploadResume(file, labelText);
        setMsg("Uploaded"); setFile(null); setLabelText("");
        setTimeout(() => setMsg(""), 2000);
    }
    return (
        <div className={card}>
            <div className="mb-3 flex items-center gap-2 text-[13px]">
                <FileText size={16} className="text-accent" />
                Current resume:{" "}
                <a className="font-medium text-accent" href={api.resumeUrl()} target="_blank" rel="noreferrer">view / download</a>
            </div>
            <div className={field}><label className={label}>Label (optional)</label><input className={input} value={labelText} onChange={(e) => setLabelText(e.target.value)} placeholder="e.g. Resume 2026" /></div>
            <div className={field}>
                <label className={label}>File (PDF / DOCX, max 10 MB)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-[13px]" />
            </div>
            <div className="flex items-center gap-3">
                <button className={btn} onClick={upload} disabled={!file}><Upload size={15} /> Upload new resume</button>
                {msg && <span className={ok}>{msg}</span>}
            </div>
        </div>
    );
}
/* ---------- Dashboard shell ---------- */
const TABS = ["profile", "projects", "blog", "resume"];
const projectFields = [
    { key: "emoji", label: "Emoji", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "tags", label: "Tags (comma separated)", type: "tags" },
    { key: "liveUrl", label: "Live URL", type: "text" },
    { key: "githubUrl", label: "GitHub URL", type: "text" },
    { key: "docsUrl", label: "Docs URL", type: "text" },
    { key: "featured", label: "Featured", type: "checkbox" },
];
const blogFields = [
    { key: "emoji", label: "Emoji", type: "text" },
    { key: "slug", label: "Slug (used in the URL)", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "meta", label: "Meta (e.g. MAY 28, 2025 · 5 MIN READ)", type: "text" },
    { key: "excerpt", label: "Excerpt", type: "textarea" },
    { key: "body", label: "Body — separate paragraphs with a blank line", type: "paragraphs" },
];
export default function Dashboard() {
    const [tab, setTab] = useState("profile");
    return (
        <div className="mx-auto max-w-[820px] px-6 py-9">
            <div className="mb-1 font-display text-[24px] font-extrabold tracking-tight">Dashboard</div>
            <div className="mb-6 text-[14px] text-muted">Edit the content that powers your public site.</div>
            <div className="mb-6 flex gap-0.5 self-start rounded-full bg-black/[0.04] p-1 w-fit">
                {TABS.map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                        className={"rounded-full px-4 py-1.5 text-[13px] font-medium capitalize cursor-pointer border-none bg-transparent " +
                            (tab === t ? "bg-surface text-ink shadow-sm" : "text-muted")}>
                        {t}
                    </button>
                ))}
            </div>
            {tab === "profile" && <ProfileEditor />}
            {tab === "projects" && (
                <CollectionEditor load={api.projects} create={api.createProject} update={api.updateProject} remove={api.deleteProject} fields={projectFields} titleKey="title" />
            )}
            {tab === "blog" && (
                <CollectionEditor load={api.blog} create={api.createBlog} update={api.updateBlog} remove={api.deleteBlog} fields={blogFields} titleKey="title" />
            )}
            {tab === "resume" && <ResumeUploader />}
        </div>
    );
}