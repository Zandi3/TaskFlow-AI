import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import {
  CHAT_MODEL,
  createLovableAiGatewayProvider,
  parseJsonFromModel,
  requireLovableApiKey,
} from "./ai-gateway.server";

export type MeetingReport = {
  summary: string;
  decisions: string[];
  actions: { owner: string; task: string; priority: "High" | "Medium" | "Low"; deadline: string }[];
};

export type EmailDraft = {
  subjects: string[];
  body: string;
};

export type PlannerResult = {
  matrix: {
    urgentImportant: PlannerTask[];
    notUrgentImportant: PlannerTask[];
    urgentNotImportant: PlannerTask[];
    notUrgentNotImportant: PlannerTask[];
  };
  schedule: { start: string; end: string; task: string; hours: number }[];
  totalHours: number;
};

export type PlannerTask = { task: string; hours: number; due: string; rationale: string };

async function complete(prompt: string, system: string) {
  const key = requireLovableApiKey();
  const gateway = createLovableAiGatewayProvider(key);
  const result = streamText({
    model: gateway(CHAT_MODEL),
    system,
    prompt,
  });
  return await result.text;
}

const JSON_RULE =
  "Respond with a single raw JSON object and nothing else. No markdown fences, no commentary.";

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ transcript: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<MeetingReport> => {
    const text = await complete(
      `Meeting notes / transcript:\n\n${data.transcript}`,
      `You analyse workplace meeting notes. ${JSON_RULE}
Shape: {"summary": string (2-4 sentence executive summary), "decisions": string[] (key decisions, concise bullets), "actions": [{"owner": string, "task": string, "priority": "High"|"Medium"|"Low", "deadline": string}]}
Use "Unassigned" when no owner is named and "TBD" when no deadline is given. Infer priority sensibly.`,
    );
    return parseJsonFromModel<MeetingReport>(text);
  });

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        recipient: z.string().default(""),
        points: z.string().min(1),
        tone: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<EmailDraft> => {
    const text = await complete(
      `Recipient: ${data.recipient || "the team"}\nTone: ${data.tone}\nBullet points to cover:\n${data.points}`,
      `You write workplace emails. ${JSON_RULE}
Shape: {"subjects": string[] (exactly 3 distinct subject line options), "body": string (the full formatted email including greeting and sign-off, plain text with \\n line breaks)}
Match the requested tone precisely and keep it concise and professional.`,
    );
    return parseJsonFromModel<EmailDraft>(text);
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tasks: z.string().min(1),
        workdayStart: z.string().default("09:00"),
        workdayHours: z.number().default(8),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<PlannerResult> => {
    const text = await complete(
      `Raw task list (may include estimated hours and due dates):\n${data.tasks}\n\nWorkday starts at ${data.workdayStart} and is about ${data.workdayHours} hours long.`,
      `You are a productivity planner. ${JSON_RULE}
Shape: {"matrix": {"urgentImportant": T[], "notUrgentImportant": T[], "urgentNotImportant": T[], "notUrgentNotImportant": T[]}, "schedule": [{"start": "HH:MM", "end": "HH:MM", "task": string, "hours": number}], "totalHours": number}
where T = {"task": string, "hours": number, "due": string, "rationale": string (max 12 words)}.
Classify every task into exactly one Eisenhower quadrant. Build a time-blocked schedule for the day in priority order, including short breaks where sensible. totalHours is the sum of scheduled task hours.`,
    );
    return parseJsonFromModel<PlannerResult>(text);
  });
