"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, X, Leaf, Brain, ChevronDown, ChevronUp } from "lucide-react";
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

/** Animated "reasoning" accordion shown above the answer bubble */
function ThoughtPanel({ thought, thinking }: { thought?: string; thinking?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  if (!thought && !thinking) return null;

  return (
    <div className="mb-1">
      <button
        onClick={() => thought && setExpanded((e) => !e)}
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-colors",
          thought
            ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer"
            : "text-amber-500 dark:text-amber-500 cursor-default"
        )}
      >
        <Brain className={cn("w-3 h-3", thinking && "animate-pulse")} />
        {thinking ? (
          <>
            <span>Thinking</span>
            <ThinkingDots />
          </>
        ) : (
          <>
            <span>View reasoning</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </>
        )}
      </button>

      {expanded && thought && (
        <div className="mx-2 mt-1 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed max-h-36 overflow-auto whitespace-pre-wrap">
          {thought}
        </div>
      )}
    </div>
  );
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const { data: session } = useSession();
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, open]);

  const predefined = [
    "Give me a planting calendar for maize in Kenya.",
    "How do I diagnose nitrogen deficiency?",
    "Suggest fertilizers for smallholder farms.",
  ];

  async function sendPrompt(text: string) {
    if (!text.trim() || sending) return;

    const userMsg: Msg = { id: `${Date.now()}u`, role: "user", text };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");

    const assistantId = `${Date.now()}a`;
    setMessages((m) => [...m, { id: assistantId, role: "assistant", text: "", streaming: true, thinking: false }]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMsgs, model }),
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
            className="w-[22rem] bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700"
            style={{ height: "540px" }}
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
                    {/* Thought panel (only for assistant) */}
                    {m.role === "assistant" && (
                      <ThoughtPanel thought={m.thought} thinking={m.thinking} />
                    )}

                    {/* Bubble */}
                    <div
                      className={cn(
                        "px-3 py-2 rounded-2xl text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-green-600 text-white rounded-br-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm"
                      )}
                    >
                      {m.role === "assistant" && !m.text && m.streaming ? (
                        <ThinkingDots />
                      ) : (
                        <div className="whitespace-pre-wrap">
                          {m.text}
                          {/* blinking cursor while typing the answer */}
                          {m.streaming && !m.thinking && m.text && (
                            <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse" />
                          )}
                        </div>
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
              {/* Predefined prompt pills */}
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
          className="p-4 rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 hover:scale-105 active:scale-95 transition-all"
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

type Msg = { id: string; role: "user" | "assistant"; text: string; streaming?: boolean };

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState<string>(process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "gemini-2.0-flash");
  const { data: session } = useSession();
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, open]);

  const predefined = [
    "Give me a quick planting calendar for maize in Kenya.",
    "How do I diagnose nitrogen deficiency from leaf images?",
    "Suggest three cost-effective fertilizers for smallholder farms.",
  ];

  async function sendPrompt(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { id: String(Date.now()) + "u", role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    const assistantId = String(Date.now()) + "a";
    setMessages((m) => [...m, { id: assistantId, role: "assistant", text: "", streaming: true }]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], model }),
      });

      if (!res.body) throw new Error("No response body from server");

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: rdone } = await reader.read();
        done = rdone;
        if (value) {
          const chunk = dec.decode(value);
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: m.text + chunk } : m))
          );
        }
      }

      // mark finished
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)));
    } catch (err) {
      setMessages((prev) => prev.map((m) => (m.role === "assistant" && m.streaming ? { ...m, streaming: false, text: "Sorry, I couldn't get a reply." } : m)));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div className="flex items-end flex-col gap-2">
        {open && (
          <div className="w-96 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700" style={{ height: '520px' }}>
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">DIGI Assistant</div>
                  <div className="text-xs text-green-100">AI-powered farming companion</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="text-xs bg-white/20 border border-white/30 rounded px-2 py-1 text-white"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gemini-2.0-flash-thinking-exp">Gemini 2.0 Flash Thinking</option>
                </select>
                <button className="p-1 rounded hover:bg-white/20" onClick={() => setOpen(false)} aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={scroller} className="flex-1 p-3 overflow-auto space-y-3" style={{ minHeight: 240 }}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">How can I help your farm today?</p>
                  <p className="text-xs text-slate-400">Try a suggestion below or ask anything.</p>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={cn("flex items-start gap-2", m.role === "user" ? "justify-end" : "justify-start") }>
                  {m.role === "assistant" && (
                    <div className="h-8 w-8 shrink-0 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-green-600" />
                    </div>
                  )}

                  <div className={cn("max-w-[80%] px-3 py-2 rounded-xl", m.role === "user" ? "bg-green-600 text-white rounded-br-none" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none") }>
                    <div className="whitespace-pre-wrap">{m.text}{m.streaming && <span className="inline-block ml-2"><ThinkingDots /></span>}</div>
                  </div>

                  {m.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback>{(session?.user?.name || "U").slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {predefined.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendPrompt(p)}
                    disabled={sending}
                    className="text-xs px-2.5 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-40"
                  >
                    {p.length > 28 ? p.slice(0, 28) + '…' : p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPrompt(input); } }}
                  rows={1}
                  className="flex-1 resize-none px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ask the assistant… (Enter to send)"
                />
                <Button onClick={() => sendPrompt(input)} disabled={sending || !input.trim()} size="icon" className="shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="p-4 rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 hover:scale-105 active:scale-95 transition-all"
          aria-label="Open chat"
        >
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
