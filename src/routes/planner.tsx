import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyOutput, PageHeader, Panel, Section } from "@/components/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — TaskFlow" },
      {
        name: "description",
        content:
          "Break a goal into a sequenced, effort-estimated task plan with owners and a suggested working order.",
      },
      { property: "og:title", content: "AI Task Planner — TaskFlow" },
      {
        property: "og:description",
        content: "Break a goal into a sequenced, effort-estimated task plan.",
      },
    ],
  }),
  component: TaskPlanner,
});

type Task = { title: string; effort: string; day: string };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const EFFORT = ["S", "M", "L"];

function TaskPlanner() {
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [horizon, setHorizon] = useState([5]);
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState<Task[] | null>(null);

  function generate() {
    if (!goal.trim()) return;
    setBusy(true);
    setTimeout(() => {
      const seeds = [
        `Scope and define success criteria for "${goal.trim()}"`,
        "Map dependencies and identify blockers",
        "Draft the first working version",
        "Review with stakeholders and collect feedback",
        "Incorporate feedback and prepare handoff",
        "Ship and document outcomes",
        "Run a short retrospective",
      ];
      const count = Math.min(horizon[0] ?? 5, seeds.length);
      setPlan(
        seeds.slice(0, count).map((title, i) => ({
          title,
          effort: EFFORT[i % EFFORT.length] as string,
          day: DAYS[i % DAYS.length] as string,
        })),
      );
      setBusy(false);
    }, 1000);
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        description="State the outcome you want. TaskFlow sequences the work into sized, scheduled steps."
      />

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <section className="enter" style={{ animationDelay: "120ms" }}>
          <Panel
            label="Objective"
            footer={
              <Button size="sm" className="ml-auto gap-2" onClick={generate} disabled={busy}>
                <Sparkles className="size-3.5" />
                {busy ? "Planning…" : "Generate Plan"}
              </Button>
            }
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="goal" className="label-mono">
                  Goal
                </Label>
                <Input
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ship the read-replica mitigation plan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="context" className="label-mono">
                  Constraints &amp; context
                </Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Two engineers available, security review required before release."
                  className="h-32 resize-none"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="label-mono">Steps</Label>
                  <span className="font-mono text-xs">{horizon[0]}</span>
                </div>
                <Slider value={horizon} onValueChange={setHorizon} min={3} max={7} step={1} />
              </div>
            </div>
          </Panel>
        </section>

        <section className="enter" style={{ animationDelay: "220ms" }}>
          <Panel label="Sequenced_Plan" busy={busy} bodyClassName="p-6 space-y-6">
            {!plan ? (
              <EmptyOutput hint="Add a goal and generate to see the sequenced plan." />
            ) : (
              <Section title="Working Order">
                <div className="space-y-3">
                  {plan.map((t, i) => (
                    <div
                      key={t.title}
                      className="flex items-start justify-between gap-3 rounded border border-border bg-surface p-3"
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox className="mt-0.5" />
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">
                            {i + 1}. {t.title}
                          </span>
                          <span className="label-mono">{t.day}</span>
                        </div>
                      </div>
                      <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">
                        {t.effort}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
