"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { GradeResources } from "@/data/grades";
import { getMentorResponse } from "@/lib/ai";

type AiMentorPanelProps = {
  resource: GradeResources;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export const AiMentorPanel = ({ resource }: AiMentorPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content:
        "Hi! I'm FaceBond Mentor. Tell me the topic or question you're stuck on, and I'll share targeted guidance.",
      timestamp: Date.now(),
    },
  ]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const prompt = (formData.get("prompt") as string)?.trim();
    if (!prompt) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    event.currentTarget.reset();
    setPending(true);

    setTimeout(() => {
      const responseText = getMentorResponse(prompt, `grade ${resource.grade}`);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setPending(false);
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  const stats = useMemo(() => {
    const total = messages.filter((m) => m.role === "user").length;
    const lastMessage = messages[messages.length - 1];
    return {
      prompts: total,
      lastResponse:
        lastMessage && lastMessage.role === "assistant"
          ? new Date(lastMessage.timestamp).toLocaleTimeString()
          : "—",
    };
  }, [messages]);

  return (
    <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
            FaceBond Mentor AI
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Personal Guidance for Grade {resource.grade}
          </h2>
        </div>
        <dl className="flex gap-6 text-xs uppercase tracking-[0.2em] text-slate-300/80">
          <div>
            <dt>Prompts</dt>
            <dd className="text-base font-semibold text-emerald-200">
              {stats.prompts}
            </dd>
          </div>
          <div>
            <dt>Last Response</dt>
            <dd className="text-base font-semibold text-emerald-200">
              {stats.lastResponse}
            </dd>
          </div>
        </dl>
      </header>

      <div className="mt-5 h-72 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
        <div className="h-full overflow-y-auto px-4 py-5">
          {messages.map((message) => (
            <div
              key={message.timestamp}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-emerald-500 text-emerald-950" : "bg-slate-800 text-slate-100"}`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-300">
                Thinking…
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:flex-row"
      >
        <input
          name="prompt"
          placeholder="Ask for a concept breakdown, study plan, or exam tip…"
          className="flex-1 rounded-xl border border-slate-800 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-80"
          disabled={pending}
        >
          {pending ? "Mentor Typing…" : "Send"}
        </button>
      </form>
    </section>
  );
};

