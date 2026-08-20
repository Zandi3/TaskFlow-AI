import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyOutput, PageHeader, Panel, Section } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — TaskFlow" },
      {
        name: "description",
        content:
          "Draft clear, on-tone workplace emails in seconds. Set the recipient, intent and tone, and TaskFlow writes the message.",
      },
      { property: "og:title", content: "Smart Email Generator — TaskFlow" },
      {
        property: "og:description",
        content: "Draft clear, on-tone workplace emails in seconds.",
      },
    ],
  }),
  component: EmailGenerator,
});

const TONES = ["Executive brief", "Friendly", "Direct", "Diplomatic", "Formal"];

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [intent, setIntent] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);

  function generate() {
    if (!intent.trim()) return;
    setBusy(true);
    setTimeout(() => {
      const who = recipient.trim() || "team";
      const first = who.split(/[\s,@]/)[0];
      setDraft({
        subject: intent.trim().replace(/^./, (c) => c.toUpperCase()).slice(0, 72),
        body: `Hi ${first},\n\n${intent.trim().replace(/^./, (c) => c.toUpperCase())}${
          intent.trim().endsWith(".") ? "" : "."
        }\n\nI've outlined the next steps below so we can keep this moving:\n\n1. Confirm scope and owners by end of day.\n2. Share any blockers in the thread rather than in DMs.\n3. Reconvene briefly once the first pass is ready.\n\nHappy to adjust if you'd prefer a different approach — let me know what works.\n\nBest,\nSarah`,
      });
      setBusy(false);
    }, 1000);
  }

  return (
    <AppShell>
      <PageHeader
        title="Smart Email Generator"
        description="Describe the intent once. TaskFlow shapes the subject line, structure and tone for you."
      />

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <section className="enter" style={{ animationDelay: "120ms" }}>
          <Panel
            label="Draft_Brief"
            footer={
              <Button size="sm" className="ml-auto gap-2" onClick={generate} disabled={busy}>
                <Sparkles className="size-3.5" />
                {busy ? "Writing…" : "Generate Draft"}
              </Button>
            }
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="label-mono">
                  Recipient
                </Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Marcus, Infrastructure team…"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intent" className="label-mono">
                  What should it say?
                </Label>
                <Textarea
                  id="intent"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  placeholder="Ask for a status update on the read-replica rollout and flag the Friday deadline."
                  className="h-40 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-mono">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Panel>
        </section>

        <section className="enter" style={{ animationDelay: "220ms" }}>
          <Panel
            label="Generated_Draft"
            busy={busy}
            bodyClassName="p-6 space-y-6"
            footer={
              draft ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto gap-2"
                  onClick={() => {
                    void navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);
                    toast.success("Draft copied to clipboard");
                  }}
                >
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              ) : undefined
            }
          >
            {!draft ? (
              <EmptyOutput hint="Describe the message and generate to see the draft." />
            ) : (
              <>
                <Section title="Subject">
                  <p className="text-sm font-medium">{draft.subject}</p>
                </Section>
                <Section title={`Body — ${tone}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {draft.body}
                  </p>
                </Section>
              </>
            )}
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
