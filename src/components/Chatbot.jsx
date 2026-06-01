import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Arrowup } from "lucide-react";
import { api } from "../api/client.js";

const QUICK=[
    {label: "Live projects", text: "What projects are live?"},
    {label: "Stack", text: "What stack do you use?"}
]

const GREETING = {
    role: "bot",
    text: "Hey! I'm the Spland assistant. Ask me anything about the projects, blogs, or anything else on Spland."
}

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([GREETING]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const msgsRef = useRef(null);

    useEffect(() => {
        if(msgsRef.current) {
            msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
        }
    }, [messages, open]);

    async function send(text) {
        const trimmed = (text ?? input).trim();
        if(!trimmed || busy) return;
        const userMsg = { role: "user", text: trimmed };
        setMessages((m) => [...m, userMsg, { role: "bot", text: "...", pending: true }]);
        setInput("");
        setBusy(true);
        try {
            const { reply } = await api.chat(trimmed);
            setMessages((m) => replaceLastPending(m, reply));
        } catch (e) {
            setMessages((m) => replaceLastPending(m, "Sorry, I couldn't reach the assistant right now. Try the Contact page." ));
        }
        finally {
            setBusy(false);
        }
    }

    return (
        <>
            <button className="chat-fab" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close chat" : "Open chat"}>
                {open ? <X size={22} /> : <MessageCircle size={22} />}
            </button>

            {open && (
                <div className="chatwin open">
                    <div className="chat-head">
                        <div className="ca">*</div>
                        <div>
                            <div className="chat-title">Spland Assistant</div>
                            <div className="chat-sub">Ask me anything about this site</div>
                        </div>
                        <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
                            <X size={17} />
                        </button>
                    </div>

                    <div className="chat-msgs" ref={msgsRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`msg ${m.role === "user" ? "user" : "bot"}`}>
                                {m.text}
                            </div>
                        ))}
                    </div>

                    <div className="chat-chips">
                        {QUICK.map((q) => (
                            <button key={q.text} className="chip" onClick={() => send(q.text)} disabled={busy}>
                                {q.label}
                            </button>
                        ))}
                    </div>

                    <div className="chat-inp">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                            placeholder="Type your message..."
                            disabled={busy}
                        />
                        <button className="chat-send" onClick={() => send()} disabled={busy} aria-label="Send message">
                            <Arrowup size={15} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function replaceLastPending(list, text) {
    const copy = [...list];
    for(let i = copy.length - 1; i >= 0; i--) {
        if(copy[i].pending) {
            copy[i] = { role: "bot", text };
            break;
        }    
    }
    return copy;
}