"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, X, Leaf, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ThinkingDots from "@/components/chat/ThinkingDots";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  thought?: string;   // accumulated reasoning summary
  thinking?: boolean; // true while thought tokens are still streaming
  streaming?: boolean;// true while any tokens are streaming
};

const predefined = [
  "Give me a planting calendar for maize in Kenya.",
  "How do I diagnose nitrogen deficiency?",
  "Suggest fertilizers for smallholder farms.",
];

/** Markdown components for well-formatted assistant responses */
const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  h1: ({ children }) => <h1 className="text-base font-bold mb-1 mt-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-sm font-bold mb-1 mt-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-1.5">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ inline, children }: any) =>
    inline ? (
      <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
    ) : (
      <code className="block bg-slate-200 dark:bg-slate-700 p-2.5 rounded-lg my-1.5 overflow-x-auto text-xs font-mono whitespace-pre">{children}</code>
    ),
  pre: ({ children }) => <pre className="my-1.5 overflow-x-auto">{children}</pre>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-green-400 pl-2.5 italic text-slate-500 dark:text-slate-400 my-1.5">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 underline underline-offset-2">{children}</a>
  ),
  hr: () => <hr className="my-2 border-slate-200 dark:border-slate-700" />,
  table: ({ children }) => <table className="w-full text-xs border-collapse my-2">{children}</table>,
  th: ({ children }) => <th className="border border-slate-300 dark:border-slate-600 px-2 py-1 bg-slate-100 dark:bg-slate-700 font-semibold text-left">{children}</th>,
  td: ({ children }) => <td className="border border-slate-300 dark:border-slate-600 px-2 py-1">{children}</td>,
};

export default function FloatingChat() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const [showPrompts, setShowPrompts] = useState(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("df_chat_seen");
    if (seen === "1") setShowPrompts(false);
  }, []);

  // Silently get user location for Maps grounding
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  async function sendPrompt(text: string) {
    if (!text.trim() || sending) return;

    const userMsg: Msg = { id: `${Date.now()}u`, role: "user", text };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("df_chat_seen", "1");
        setShowPrompts(false);
      }
    } catch {}

    const assistantId = `${Date.now()}a`;
    setMessages((m) => [...m, { id: assistantId, role: "assistant", text: "", streaming: true, thinking: false }]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMsgs, model, ...(userCoords ?? {}) }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += dec.decode(value, { stream: true });

        // parse complete NDJSON lines
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as { t: "thought" | "answer" | "error"; d: string };
            if (event.t === "thought") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, thought: (m.thought ?? "") + event.d, thinking: true } : m
                )
              );
            } else if (event.t === "answer") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, text: m.text + event.d, thinking: false } : m
                )
              );
            } else if (event.t === "error") {
              throw new Error(event.d);
            }
          } catch {}
        }
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, streaming: false, thinking: false } : m))
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, streaming: false, thinking: false, text: m.text || `Error: ${err?.message ?? "Something went wrong."}` }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  }

  const initials = (session?.user?.name || "U").slice(0, 2).toUpperCase();

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div className="flex items-end flex-col gap-3">
        {open && (
          <div
            className="w-[92vw] sm:w-[28rem] md:w-[32rem] lg:w-[36rem] bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 h-[70vh] sm:h-[68vh] md:h-[64vh] lg:h-[540px]"
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">DIGI Assistant</div>
                  <div className="text-xs text-green-100">AI-powered farming companion</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="text-xs bg-white/15 border border-white/30 rounded-lg px-2 py-1 text-white focus:outline-none"
                >
                  <option value="gemini-2.5-flash">2.5 Flash ✦</option>
                  <option value="gemini-2.5-pro">2.5 Pro</option>
                  <option value="gemini-3-flash-preview">3 Flash Preview</option>
                </select>
                <button
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages ────────────────────────────────────────── */}
            <div ref={scroller} className="flex-1 px-3 py-3 overflow-y-auto space-y-4 min-h-0">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
                    How can I help your farm today?
                  </p>
                  <p className="text-xs text-slate-400 text-center">Try a suggestion below, or ask anything.</p>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {/* Bot avatar */}
                  {m.role === "assistant" && (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-0.5">
                      <Leaf className="w-3.5 h-3.5 text-green-600" />
                    </div>
                  )}

                  <div className="flex flex-col max-w-[82%]">
                    {/* Bubble */}
                    <div
                      className={cn(
                        "px-3 py-2 rounded-2xl text-sm",
                        m.role === "user"
                          ? "bg-green-600 text-white rounded-br-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm"
                      )}
                    >
                      {m.role === "assistant" && !m.text && m.streaming ? (
                        <ThinkingDots />
                      ) : m.role === "assistant" ? (
                        <div className="text-sm">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                            {m.text}
                          </ReactMarkdown>
                          {/* blinking cursor while streaming */}
                          {m.streaming && m.text && (
                            <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse" />
                          )}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                      )}
                    </div>
                  </div>

                  {/* User avatar */}
                  {m.role === "user" && (
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={session?.user?.image ?? ""} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* ── Footer ──────────────────────────────────────────── */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
              {/* Predefined prompt pills (hidden after first send) */}
              {showPrompts && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {predefined.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendPrompt(p)}
                      disabled={sending}
                      className="text-xs px-2.5 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-40"
                    >
                      {p.length > 30 ? p.slice(0, 30) + "…" : p}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendPrompt(input);
                    }
                  }}
                  rows={1}
                  className="flex-1 resize-none px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 max-h-24"
                  placeholder="Ask the assistant… (Enter to send)"
                />
                <Button
                  onClick={() => sendPrompt(input)}
                  disabled={sending || !input.trim()}
                  size="icon"
                  className="shrink-0 h-9 w-9 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── FAB ──────────────────────────────────────────────── */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-5 md:p-6 rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 hover:scale-105 active:scale-95 transition-all"
          aria-label={open ? "Close chat" : "Open chat"}
          style={{ boxShadow: '0 10px 30px rgba(16,185,129,0.18)' }}
        >
          {open ? <X className="w-6 h-6 md:w-7 md:h-7" /> : <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />}
        </button>
      </div>
    </div>
  );
}
