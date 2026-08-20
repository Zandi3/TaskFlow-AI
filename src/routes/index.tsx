import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyOutput, PageHeader, Panel, Section } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — TaskFlow" },
      {
        name: "description",
        content:
          "Turn raw meeting transcripts into an executive summary, key decisions and owned action items with TaskFlow.",
      },
      { property: "og:title", content: "Meeting Summarizer — TaskFlow" },
      {
        property: "og:description",
        content: "Turn raw meeting transcripts into decisions and action items.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

const SAMPLE = `[00:02:14] Alex: The core issue is latency in the primary database cluster.
[00:02:30] Marcus: We saw a 15% spike in write operations during the marketing event.
[00:02:45] Sarah: We need a mitigation plan by Friday. Can we spin up a read replica?
[00:03:02] Alex: I'll handle the terraform changes this afternoon.`;

type Report = {
  summary: string;
  decisions: string[];
  actions: { task: string; owner: string }[];
};

function MeetingSummarizer() {
  const [transcript, setTranscript] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  function generate() {
    if (!transcript.trim()) return;
    setBusy(true);
    setTimeout(() => {
      const speakers = Array.from(
        new Set(
          transcript
            .split("\n")
            .map((l) => l.match(/]\s*([A-Za-z]+):/)?.[1])
            .filter(Boolean) as string[],
        ),
      );
      const lines = transcript
        .split("\n")
        .map((l) => l.replace(/^\[[^\]]*\]\s*/, "").trim())
        .filter(Boolean);

      setReport({
        summary:
          lines.slice(0, 2).join(" ") ||
          "The discussion covered the current blockers and next steps agreed by the group.",
        decisions: lines
          .filter((l) => /need|should|agree|plan|will|can we/i.test(l))
          .slice(0, 3)
          .map((l) => l.replace(/^[A-Za-z]+:\s*/, "")),
        actions: lines
          .filter((l) => /I'?ll|handle|draft|prepare|finalis|finaliz/i.test(l))
          .slice(0, 4)
          .map((l, i) => ({
            task: l.replace(/^[A-Za-z]+:\s*/, ""),
            owner: speakers[i % Math.max(speakers.length, 1)] ?? "Unassigned",
          })),
      });
      setBusy(false);
    }, 1200);
  }

  return (
    <AppShell>
      <PageHeader
        title="Meeting Summarizer"
        description="Transform raw transcripts into actionable intelligence. Optimized for executive review."
      />

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <section className="enter" style={{ animationDelay: "120ms" }}>
          <Panel
            label="Input_Source"
            action={
              <button
                onClick={() => setTranscript(SAMPLE)}
                className="label-mono rounded px-2 py-0.5 font-bold text-signal hover:bg-accent"
              >
                Auto-Paste Transcript
              </button>
            }
            footer={
              <>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="size-3.5" />
                  Upload .mp3 / .wav
                </Button>
                <Button size="sm" className="gap-2" onClick={generate} disabled={busy}>
                  <Sparkles className="size-3.5" />
                  {busy ? "Analyzing…" : "Generate Analysis"}
                </Button>
              </>
            }
          >
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              className="h-64 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed shadow-none focus-visible:ring-0"
            />
          </Panel>
        </section>

        <section className="enter" style={{ animationDelay: "220ms" }}>
          <Panel
            label="Intelligence_Report"
            busy={busy}
            bodyClassName="p-6 space-y-8"
            footer={
              report ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1">
                    Export to Notion
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Send via Slack
                  </Button>
                </>
              ) : undefined
            }
          >
            {!report ? (
              <EmptyOutput hint="Paste a transcript and generate to see the report." />
            ) : (
              <>
                <Section title="Executive Summary">
                  <p className="text-sm leading-relaxed">{report.summary}</p>
                </Section>

                {report.decisions.length > 0 && (
                  <Section title="Key Decisions">
                    <ul className="space-y-2">
                      {report.decisions.map((d) => (
                        <li key={d} className="flex items-start gap-3 text-sm">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-positive" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {report.actions.length > 0 && (
                  <Section title="Action Items">
                    <div className="space-y-3">
                      {report.actions.map((a) => (
                        <div
                          key={a.task}
                          className="flex items-center justify-between gap-3 rounded border border-border bg-surface p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox />
                            <span className="text-xs font-medium">{a.task}</span>
                          </div>
                          <span className="label-mono shrink-0">{a.owner}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </>
            )}
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
