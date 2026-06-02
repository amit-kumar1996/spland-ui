const BASE = import.meta.env.VITE_API_BASE;

function token() { return localStorage.getItem("spland_token"); }

async function req(path, { method = "GET", body, auth = false } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (auth && token()) headers.Authorization = `Bearer ${token()}`;
    const res = await fetch(`${BASE}${path}`, {
        method, headers, body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
    return res.status === 204 ? null : res.json();
}

export const api = {
    // auth
    requestOtp: (email, purpose) => req("/api/auth/otp/request", { method: "POST", body: { email, purpose } }),
    loginPassword: (email, password) => req("/api/auth/login", { method: "POST", body: { email, password } }),
    loginOtp: (email, code) => req("/api/auth/otp/verify", { method: "POST", body: { email, code } }),
    signup: (payload) => req("/api/auth/signup", { method: "POST", body: payload }),
    // content
    projects: () => req("/api/projects"),
    blog: () => req("/api/blog"),
    blogBySlug: (slug) => req(`/api/blog/${slug}`),
    profile: () => req("/api/profile"),
    resumeUrl: () => `${BASE}/api/resume`,
    // comments
    comments: (type, id) => req(`/api/comments/${type}/${id}`),
    addComment: (type, id, body) => req(`/api/comments/${type}/${id}`, { method: "POST", body: { body }, auth: true }),
    // chat
    chat: (message) => req("/api/chat", { method: "POST", body: { message } }),

    //owner writes (Dashboard)
    saveProfile: (data) => req("/api/profile", { method: "PUT", body: data, auth: true }),
    createProject: (data) => req("/api/projects", { method: "POST", body: data, auth: true }),
    updateProject: (id, data) => req(`/api/projects/${id}`, { method: "PUT", body: data, auth: true }),
    deleteProject: (id) => req(`/api/projects/${id}`, { method: "DELETE", auth: true }),
    createBlog: (data) => req("/api/blog", { method: "POST", body: data, auth: true }),
    updateBlog: (id, data) => req(`/api/blog/${id}`, { method: "PUT", body: data, auth: true }),
    deleteBlog: (id) => req(`/api/blog/${id}`, { method: "DELETE", auth: true }),

    //resume upload
    uploadResume: async (file, label) => {
        const fd = new FormData();
        fd.append("file", file);
        if (label) fd.append("label", label);
        const headers = token() ? { Authorization: `Bearer ${token()}` } : {};
        const res = await fetch(`${BASE}/api/resume`, { method: "POST", headers, body: fd });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
        return res.json();
    }
};