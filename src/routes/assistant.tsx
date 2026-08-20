import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Workplace Assistant — TaskFlow" },
      {
        name: "description",
        content:
          "Ask the TaskFlow workplace assistant about policies, meeting context, drafts and next steps.",
      },
      { property: "og:title", content: "Workplace Assistant — TaskFlow" },
      {
        property: "og:description",
        content: "Ask about policies, meeting context, drafts and next steps.",
      },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; text: string };

const PROMPTS = [
  "What did we decide about the database latency?",
  "Draft a follow-up for Marcus",
  "What's blocking the Friday deadline?",
];

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "I'm your workplace assistant. Ask me about recent meetings, drafts, or the current plan — and verify anything important before acting on it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `Here's what I have on "${q}": the most recent discussion pointed at write-capacity limits on the primary cluster, with a read replica agreed as mitigation and a Friday checkpoint. I can turn that into an email draft or a task plan if that's useful.`,
        },
      ]);
      setBusy(false);
    }, 900);
  }

  return (
    <AppShell>
      <PageHeader
        title="Workplace Assistant"
        description="A grounded chat surface over your meetings, drafts and plans."
      />

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_280px]">
        <section className="enter" style={{ animationDelay: "120ms" }}>
          <Panel
            label="Assistant_Session"
            busy={busy}
            bodyClassName="p-6"
            footer={
              <form
                className="flex w-full items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a meeting, draft, or deadline…"
                  className="bg-card"
                />
                <Button type="submit" size="icon" disabled={busy}>
                  <Send className="size-4" />
                </Button>
              </form>
            }
          >
            <div className="flex min-h-[420px] flex-col gap-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[80%] rounded-lg border border-border px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "self-end bg-primary text-primary-foreground"
                      : "self-start bg-surface",
                  )}
                >
                  {m.text}
                </div>
              ))}
              {busy && <span className="label-mono self-start">Thinking…</span>}
            </div>
          </Panel>
        </section>

        <section className="enter" style={{ animationDelay: "220ms" }}>
          <Panel label="Suggested_Prompts" bodyClassName="p-4">
            <div className="space-y-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="w-full rounded border border-border bg-surface px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
