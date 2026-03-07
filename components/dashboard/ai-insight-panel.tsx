"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Brain, Sparkles, History, ChevronDown, ChevronUp, Loader2, Send, X, Clock, Trash2 } from "lucide-react";
import { getAIConversations, deleteAIConversation } from "@/lib/actions/ai";
import { toast } from "sonner";

type Conversation = Awaited<ReturnType<typeof getAIConversations>>[number];

interface AIInsightPanelProps {
  /** e.g. "lender_underwriting", "farmer_soil" */
  module: string;
  /** Optional entity reference */
  entityId?: string;
  entityLabel?: string;
  /** Structured context data string (JSON summary) passed to Gemini */
  contextData: string;
  /** Default prompt shown in the textarea */
  defaultPrompt?: string;
  /** Card title */
  title?: string;
  /** Short description under title */
  description?: string;
}

export default function AIInsightPanel({
  module,
  entityId,
  entityLabel,
  contextData,
  defaultPrompt = "Analyze this data and provide comprehensive insights.",
  title = "AI Insights",
  description = "Get AI-powered analysis",
}: AIInsightPanelProps) {
  const [streaming, setStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [viewConv, setViewConv] = useState<Conversation | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const data = await getAIConversations(module, entityId);
      setHistory(data);
      setHistoryLoaded(true);
    } catch {}
  }, [module, entityId]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const analyze = async () => {
    if (streaming) return;
    setStreaming(true);
    setCurrentResponse("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, context: contextData, prompt, entityId, entityLabel }),
      });

      if (!res.ok && res.status !== 403) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        toast.error(err.error ?? "Analysis failed");
        setStreaming(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            if (obj.t === "answer") {
              answer += obj.d;
              setCurrentResponse((prev) => prev + obj.d);
            } else if (obj.t === "quota") {
              toast.error(obj.d);
              setCurrentResponse("");
              setStreaming(false);
              return;
            } else if (obj.t === "error") {
              toast.error(obj.d ?? "AI error");
            }
          } catch {}
        }
      }

      if (answer) {
        toast.success("Analysis complete");
        loadHistory();
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Analysis failed");
    } finally {
      setStreaming(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAIConversation(id);
      setHistory((h) => h.filter((c) => c.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
            </div>
          </div>
          {historyLoaded && history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              <History className="w-3 h-3 mr-1" />
              {history.length} {showHistory ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Previous history list */}
        {showHistory && history.length > 0 && (
          <div className="space-y-2 border-b border-purple-100 dark:border-purple-900 pb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Previous Analyses</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((conv) => (
                <div key={conv.id} className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-400">{new Date(conv.createdAt).toLocaleDateString()} {new Date(conv.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {conv.entityLabel && <Badge variant="secondary" className="text-xs py-0 px-1.5">{conv.entityLabel}</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{(conv.prompt.includes("## Request\n\n") ? conv.prompt.split("## Request\n\n").pop() ?? conv.prompt : conv.prompt).slice(0, 100)}…</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-purple-600" onClick={() => setViewConv(conv)}>
                      <span className="sr-only">View</span>
                      <Brain className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(conv.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current streaming response */}
        {(streaming || currentResponse) && (
          <div className="rounded-lg bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">AI Analysis</span>
              </div>
              {streaming && <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin" />}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentResponse || "Analyzing…"}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Prompt input */}
        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a specific question or leave as default for full analysis…"
            rows={2}
            className="text-sm resize-none border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
          />
          <Button
            onClick={analyze}
            disabled={streaming || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            {streaming ? (
              <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />Analyzing…</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5 mr-2" />Analyze with AI</>
            )}
          </Button>
        </div>
      </CardContent>

      {/* View full conversation dialog */}
      <Dialog open={!!viewConv} onOpenChange={() => setViewConv(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" /> AI Analysis
              {viewConv?.entityLabel && <Badge variant="secondary">{viewConv.entityLabel}</Badge>}
            </DialogTitle>
          </DialogHeader>
          {viewConv && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-500">
                <span className="font-medium">Analyzed:</span> {new Date(viewConv.createdAt).toLocaleString()}
                {viewConv.model && <> · <span className="font-medium">Model:</span> {viewConv.model}</>}
                {viewConv.outputTokens && <> · <span className="font-medium">Tokens:</span> {viewConv.outputTokens}</>}
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{viewConv.response}</ReactMarkdown>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
