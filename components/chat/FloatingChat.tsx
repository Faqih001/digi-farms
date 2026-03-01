"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, X, Bot, Leaf } from "lucide-react";
import ThinkingDots from "@/components/chat/ThinkingDots";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

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
