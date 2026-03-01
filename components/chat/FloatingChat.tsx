"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chat, MessageCircle, X } from "lucide-react";
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
  const [model, setModel] = useState<string>(process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "gemini-proto-1");
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
          <div className="w-96 h-120 bg-white dark:bg-slate-900 shadow-lg rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/digi-farms-logo.jpeg" />
                  <AvatarFallback>DF</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">DIGI Assistant</div>
                  <div className="text-xs text-slate-400">Smart farming companion</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="text-xs bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2 py-1"
                >
                  <option value={process.env.NEXT_PUBLIC_GEMINI_MODEL ?? "gemini-proto-1"}>Default</option>
                </select>
                <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)} aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={scroller} className="flex-1 p-3 overflow-auto space-y-3" style={{ minHeight: 240 }}>
              {messages.length === 0 && (
                <div className="text-xs text-slate-400">Try one of the suggestions below or ask your own question.</div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={cn("flex items-start gap-2", m.role === "user" ? "justify-end" : "justify-start") }>
                  {m.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/digi-farms-logo.jpeg" />
                      <AvatarFallback>DF</AvatarFallback>
                    </Avatar>
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
              <div className="flex gap-2 mb-2">
                {predefined.map((p) => (
                  <button key={p} onClick={() => sendPrompt(p)} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-200">
                    {p.length > 24 ? p.slice(0,24) + '…' : p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={1} className="flex-1 resize-none px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-800 text-sm" placeholder="Ask the assistant..." />
                <Button onClick={() => sendPrompt(input)} disabled={sending || !input.trim()}>
                  <Chat className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="p-3 rounded-full bg-green-600 text-white shadow-lg hover:scale-105 transition-transform"
          aria-label="Open chat"
        >
          <Chat className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
