"use client";

import React from "react";

export default function ThinkingDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce-slow" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce-slow animation-delay-200" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce-slow animation-delay-400" />
      <style jsx>{`
        .animate-bounce-slow { animation: chat-bounce 900ms infinite; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        @keyframes chat-bounce {
          0% { transform: translateY(0); opacity: 0.6 }
          50% { transform: translateY(-4px); opacity: 1 }
          100% { transform: translateY(0); opacity: 0.6 }
        }
      `}</style>
    </span>
  );
}
