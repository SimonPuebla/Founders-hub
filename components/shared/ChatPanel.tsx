"use client";

import * as React from "react";
import { MessageSquare, X, Send, Loader2, Minimize2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  actions?: { label: string }[];
}

const WELCOME: Message = {
  role: "assistant",
  content: "Hola Simo. Tengo tu lista de tareas cargada. Puedo marcar tareas como hechas, posponerlas, cambiar su estado, crear nuevas, o responder preguntas sobre tu día. ¿En qué arrancamos?",
};

export function ChatPanel() {
  const { chatOpen, setChatOpen } = useAppStore();
  const [messages, setMessages] = React.useState<Message[]>([WELCOME]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [minimized, setMinimized] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opening
  React.useEffect(() => {
    if (chatOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [chatOpen, minimized]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m) => m.role !== "assistant" || m !== WELCOME)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            actions: data.actions?.length ? data.actions : undefined,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{ background: "var(--blue)", color: "white" }}
        title="Chat with tasks (C)"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col rounded-xl shadow-2xl overflow-hidden"
      style={{
        width: 380,
        height: minimized ? "auto" : 520,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 8px 32px oklch(0% 0 0 / 0.14)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: minimized ? "none" : "1px solid var(--border)", background: "var(--surface)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--blue-light)" }}
          >
            <MessageSquare className="w-3.5 h-3.5" style={{ color: "var(--blue)" }} />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Task Chat
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: "var(--green-light)", color: "var(--green)" }}>
            z.ai
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className="max-w-[88%] space-y-1.5">
                  <div
                    className="rounded-xl px-3 py-2 text-[13px] leading-relaxed"
                    style={
                      msg.role === "user"
                        ? { background: "var(--blue)", color: "white" }
                        : { background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
                    }
                  >
                    {msg.content}
                  </div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="space-y-1 pl-1">
                      {msg.actions.map((a, j) => (
                        <div
                          key={j}
                          className="text-[11px] font-medium px-2 py-1 rounded"
                          style={{ color: "var(--green)", background: "var(--green-light)" }}
                        >
                          {a.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-xl px-3 py-2 flex items-center gap-2"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--text-muted)" }} />
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="px-3 py-3 shrink-0"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask or tell me something..."
                className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-[var(--text-muted)]"
                style={{ color: "var(--text-primary)" }}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="shrink-0 rounded-md p-1.5 transition-colors disabled:opacity-40"
                style={{ background: "var(--blue)", color: "white" }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] mt-1.5 px-1" style={{ color: "var(--text-muted)" }}>
              Enter to send · C to toggle · Tasks updated live
            </p>
          </div>
        </>
      )}
    </div>
  );
}
