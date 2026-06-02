import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { api } from "../api/client.js";

const QUICK = [
  { label: "🚀 Live projects", text: "What projects are live?" },
  { label: "💼 Hire?", text: "Are you available to hire?" },
  { label: "🛠 Stack", text: "What stack do you use?" },
];

const GREETING = {
  role: "bot",
  text: "Hey! 👋 I'm the Spland assistant. Ask me about projects, experience, or availability.",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const msgsRef = useRef(null);

  useEffect(() => {
    const el = msgsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  async function send(text) {
    const trimmed = (text ?? input).trim();

    if (!trimmed || busy) return;

    setInput("");

    setMessages((m) => [
      ...m,
      { role: "user", text: trimmed },
      { role: "bot", text: "...", pending: true },
    ]);

    setBusy(true);

    try {
      const { reply } = await api.chat(trimmed);
      setMessages((m) => replaceLastPending(m, reply));
    } catch {
      setMessages((m) =>
        replaceLastPending(
          m,
          "Sorry, I couldn't reach the assistant right now. Try the Contact page."
        )
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        className="fixed bottom-6 right-6 z-[180] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_16px_rgba(45,90,61,0.3)] transition-transform hover:scale-110"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-[88px] right-6 z-[180] flex max-h-[440px] w-[300px] flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
          <div className="flex items-center gap-2.5 bg-accent px-[15px] py-[13px] text-white">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/20 text-[14px]">
              🌿
            </div>

            <div>
              <div className="font-display text-[14px] font-bold">
                Spland Assistant
              </div>

              <div className="text-[11px] opacity-75">
                Ask me anything about this site
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="ml-auto opacity-70 hover:opacity-100"
            >
              <X size={17} />
            </button>
          </div>

          <div
            ref={msgsRef}
            className="flex flex-1 flex-col gap-2 overflow-y-auto bg-canvas p-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "max-w-[85%] rounded-[14px] px-3 py-2 text-[13px] leading-relaxed " +
                  (m.role === "user"
                    ? "self-end rounded-br-[4px] bg-accent text-white"
                    : "self-start rounded-bl-[4px] border border-line bg-surface")
                }
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 bg-canvas px-3 pb-2.5">
            {QUICK.map((q) => (
              <button
                key={q.text}
                onClick={() => send(q.text)}
                disabled={busy}
                className="cursor-pointer rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-muted hover:border-accent hover:text-accent"
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 border-t border-line bg-surface px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask something..."
              disabled={busy}
              className="flex-1 rounded-full border border-line bg-canvas px-3 py-1.5 text-[13px] text-ink outline-none focus:border-accent"
            />

            <button
              onClick={() => send()}
              disabled={busy}
              aria-label="Send"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function replaceLastPending(list, text) {
  const copy = [...list];

  for (let i = copy.length - 1; i >= 0; i--) {
    if (copy[i].pending) {
      copy[i] = { role: "bot", text };
      break;
    }
  }

  return copy;
}