import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

// ─── Zhipu AI (z.ai) JWT auth ────────────────────────────────────────────────

function generateZhipuToken(apiKey: string): string {
  const dotIdx = apiKey.indexOf(".");
  const id = apiKey.slice(0, dotIdx);
  const secret = apiKey.slice(dotIdx + 1);

  const header = Buffer.from(JSON.stringify({ alg: "HS256", sign_type: "SIGN" })).toString("base64url");
  const now = Date.now();
  const payload = Buffer.from(JSON.stringify({
    api_key: id,
    exp: now + 3600 * 1000,
    timestamp: now,
  })).toString("base64url");

  const signature = createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

// ─── Tools (function calling) ────────────────────────────────────────────────

const TOOLS = [
  {
    type: "function",
    function: {
      name: "mark_task_done",
      description: "Mark a task as done/completed",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "UUID of the task" },
        },
        required: ["task_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "postpone_task",
      description: "Postpone a task's due date by N days from today (default 1 = tomorrow)",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "UUID of the task" },
          days: { type: "number", description: "Days to postpone (default 1)" },
        },
        required: ["task_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_task_status",
      description: "Update the status of a task",
      parameters: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "UUID of the task" },
          status: {
            type: "string",
            enum: ["todo", "doing", "waiting", "blocked", "done", "delegated"],
          },
        },
        required: ["task_id", "status"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Create a new task",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Task title" },
          priority: {
            type: "string",
            enum: ["critical", "high", "medium", "low"],
            description: "Task priority (default medium)",
          },
          project: { type: "string", description: "Project name (optional)" },
        },
        required: ["title"],
      },
    },
  },
];

// ─── Tool execution ───────────────────────────────────────────────────────────

type Action = { label: string; detail?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeTool(
  name: string,
  args: Record<string, unknown>,
  supabase: any
): Promise<{ result: string; action: Action }> {
  const now = new Date().toISOString();

  if (name === "mark_task_done") {
    const { data } = await supabase
      .from("tasks")
      .update({ status: "done", updated_at: now })
      .eq("id", args.task_id)
      .select("title")
      .single();
    return {
      result: `Task "${data?.title}" marked as done.`,
      action: { label: `✓ "${data?.title ?? args.task_id}" done` },
    };
  }

  if (name === "postpone_task") {
    const days = (args.days as number) ?? 1;
    const date = new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
    const { data } = await supabase
      .from("tasks")
      .update({ due_date: date, updated_at: now })
      .eq("id", args.task_id)
      .select("title")
      .single();
    const label = days === 1 ? "tomorrow" : `+${days}d`;
    return {
      result: `Task "${data?.title}" postponed to ${date}.`,
      action: { label: `→ "${data?.title ?? args.task_id}" postponed to ${label}` },
    };
  }

  if (name === "update_task_status") {
    const { data } = await supabase
      .from("tasks")
      .update({ status: args.status, updated_at: now })
      .eq("id", args.task_id)
      .select("title")
      .single();
    return {
      result: `Task "${data?.title}" status updated to ${args.status}.`,
      action: { label: `↻ "${data?.title ?? args.task_id}" → ${args.status}` },
    };
  }

  if (name === "create_task") {
    const { data } = await supabase
      .from("tasks")
      .insert({
        title: args.title,
        priority: (args.priority as string) ?? "medium",
        project: (args.project as string) ?? null,
        status: "todo",
        progress: 0,
        created_at: now,
        updated_at: now,
      })
      .select("title")
      .single();
    return {
      result: `Task "${data?.title}" created.`,
      action: { label: `+ "${data?.title}" created` },
    };
  }

  return { result: "Unknown tool", action: { label: "?" } };
}

// ─── Build system prompt from live data ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildContext(supabase: any): Promise<string> {
  const [{ data: tasks }, { data: okrs }] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, status, priority, project, due_date")
      .not("status", "eq", "done")
      .order("priority")
      .order("due_date"),
    supabase
      .from("okrs")
      .select("title, status, progress")
      .not("status", "in", '("completed","paused")')
      .order("created_at"),
  ]);

  const today = new Date().toISOString().split("T")[0];

  const taskLines = (tasks ?? [])
    .map((t) => {
      const due = t.due_date ? ` | due: ${t.due_date}${t.due_date < today ? " ⚠ overdue" : ""}` : "";
      return `  - [${t.status}][${t.priority}] ${t.title} (ID: ${t.id}, project: ${t.project ?? "none"}${due})`;
    })
    .join("\n");

  const okrLines = (okrs ?? [])
    .map((o) => `  - [${o.status}] ${o.title} — ${o.progress}%`)
    .join("\n");

  return `You are Simo's AI assistant inside Andén Founders Hub, his personal founder OS.
Today: ${today} (Buenos Aires, UTC-3)

## Active tasks (${(tasks ?? []).length} total)
${taskLines || "  (no active tasks)"}

## OKRs
${okrLines || "  (no active OKRs)"}

## Instructions
- Be concise and direct. Simo is a busy founder.
- Match tasks by partial name — if he says "hedera deck", find the task about the Hedera deck.
- When taking an action, use the exact task ID from the list above.
- After using a tool, briefly confirm what you did (one sentence).
- You can answer questions about tasks, update statuses, mark done, postpone, or create new tasks.
- Respond in the same language Simo uses (Spanish or English).`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ZAI_API_KEY not configured" }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { messages: userMessages } = await req.json() as {
    messages: { role: string; content: string }[];
  };

  const systemPrompt = await buildContext(supabase);
  const messages: Record<string, unknown>[] = [
    { role: "system", content: systemPrompt },
    ...userMessages,
  ];

  const token = generateZhipuToken(apiKey);
  const actions: Action[] = [];

  // Tool-calling loop — max 4 rounds
  for (let round = 0; round < 4; round++) {
    const res = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages,
        tools: TOOLS,
        tool_choice: "auto",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `z.ai error: ${err}` }, { status: 500 });
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    if (!choice) return NextResponse.json({ error: "No response from z.ai" }, { status: 500 });

    // No tool calls — return the final text response
    if (choice.finish_reason !== "tool_calls" || !choice.message.tool_calls) {
      return NextResponse.json({
        message: choice.message.content ?? "",
        actions,
      });
    }

    // Execute tool calls
    const assistantMsg = choice.message;
    messages.push(assistantMsg);

    for (const toolCall of assistantMsg.tool_calls as Record<string, unknown>[]) {
      const fn = toolCall.function as { name: string; arguments: string };
      const args = JSON.parse(fn.arguments) as Record<string, unknown>;
      const { result, action } = await executeTool(fn.name, args, supabase);
      actions.push(action);
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }

  return NextResponse.json({ message: "Done.", actions });
}
