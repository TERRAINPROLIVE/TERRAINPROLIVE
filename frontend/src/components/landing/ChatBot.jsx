import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Hammer,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STORAGE_KEY = "terrainpro:chat";

function makeSessionId() {
  return `tp-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

const SUGGESTIONS = [
  "How accurate are your quotes?",
  "How much concrete for a 60m² slab?",
  "What's included in the Crew plan?",
  "Can I export to Xero?",
];

const INTRO = {
  role: "assistant",
  content:
    "G'day — I'm the TerrainPRO Helper. Ask me anything about how the AI quoter works, pricing, or quick trade questions (concrete volumes, mesh specs, spoil rates) and the best local spots for smoko.",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([INTRO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sessionId) setSessionId(parsed.sessionId);
        if (Array.isArray(parsed?.messages) && parsed.messages.length > 0) {
          setMessages(parsed.messages);
        }
      }
    } catch {
      /* ignore */
    }
    setSessionId((s) => s || makeSessionId());
  }, []);

  // Persist
  useEffect(() => {
    if (!sessionId) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, messages }));
    } catch {
      /* ignore */
    }
  }, [sessionId, messages]);

  // Auto-scroll on new message / open
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setUnread(false);
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sendMessage = async (text) => {
    const value = (text ?? input).trim();
    if (!value || loading) return;
    const nextMessages = [...messages, { role: "user", content: value }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/chat/message`, {
        session_id: sessionId,
        // Send up to last 20 messages for context
        messages: nextMessages.slice(-20),
      });
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (!open) setUnread(true);
    } catch (err) {
      const msg =
        err?.response?.data?.detail || err?.message || "Couldn't reach the helper.";
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠ ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([INTRO]);
    setSessionId(makeSessionId());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(true)}
            data-testid="chatbot-launcher"
            aria-label="Open Toolbox Talks"
            className="fixed bottom-20 right-5 sm:bottom-24 sm:right-6 z-40 inline-flex items-center gap-3 h-14 pl-4 pr-5 bg-yellow-500 text-black border-2 border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)] btn-industrial"
          >
            <span className="w-9 h-9 grid place-items-center bg-black/10">
              <Hammer className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="font-display uppercase text-sm tracking-[0.18em] font-bold">
              Toolbox Talks
            </span>
            {unread && (
              <span
                data-testid="chatbot-unread"
                className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"
                aria-label="new message"
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            data-testid="chatbot-panel"
            className="fixed z-40 bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] max-h-[400px] sm:max-h-[560px] bg-neutral-950 border border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-3 h-12 border-b border-neutral-800 bg-black">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 grid place-items-center bg-yellow-500 text-black">
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
                <div className="flex flex-col leading-none">
                  <span className="font-display uppercase text-sm tracking-tight">
                    Toolbox Talks
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-yellow-500 mt-0.5">
                    GPT-5.2 · LIVE
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  data-testid="chatbot-reset"
                  className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 hover:text-yellow-500 transition-colors px-2 py-1"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  data-testid="chatbot-close"
                  aria-label="Close chat"
                  className="w-8 h-8 grid place-items-center border border-neutral-800 text-neutral-300 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              data-testid="chatbot-messages"
              className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[240px] sm:max-h-[400px] no-scrollbar"
            >
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-yellow-500 text-xs font-mono uppercase tracking-[0.25em]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Tradie thinking...
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div
                  data-testid="chatbot-suggestions"
                  className="pt-3 grid grid-cols-1 gap-2"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-1">
                    Try asking
                  </div>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendMessage(s)}
                      data-testid={`chatbot-suggestion-${i}`}
                      className="text-left px-3 py-2.5 border border-neutral-800 text-xs text-neutral-300 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="border-t border-neutral-800 bg-black p-2 flex gap-2"
            >
              <input
                ref={inputRef}
                data-testid="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about quotes, materials, pricing..."
                className="flex-1 h-10 px-3 bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-yellow-500 rounded-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                data-testid="chatbot-send"
                className="inline-flex items-center justify-center w-10 h-10 bg-yellow-500 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
                aria-label="Send"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" strokeWidth={2.5} />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      data-testid={`chatbot-msg-${role}`}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-3 py-2 text-sm leading-snug whitespace-pre-wrap ${
          isUser
            ? "bg-yellow-500 text-black"
            : "bg-neutral-900 border border-neutral-800 text-neutral-100"
        }`}
      >
        {!isUser && (
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-yellow-500 mb-1">
            TerrainPRO
          </div>
        )}
        {content}
      </div>
    </div>
  );
}
