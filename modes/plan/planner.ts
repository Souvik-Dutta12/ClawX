import {
    stepCountIs,
    streamText,
    tool,
} from "ai";
import { z } from 'zod';
import chalk from 'chalk';
import { getAgentModel } from "../../ai/ai.config.ts";
import { ActionTracker } from "../agent/action-tracker.ts";
import { ToolExecutor } from "../agent/tool-executer.ts";
import { defaultAgentConfig } from "../agent/types.ts";
import type { PlanStep } from './types.ts';
import { createWebTools } from "./web-tools.ts";
import { logError, logInfo } from "../../utils/error.ts";

const planSchema = z.object({
    title: z.string().optional(),
    researchSummary: z.string().optional(),
    assumptions: z.array(z.string()).optional(),
    techStack: z
        .array(
            z.object({
                name: z.string(),
                purpose: z.string().optional(),
            }),
        )
        .optional(),
    diagrams: z
        .array(
            z.object({
                title: z.string(),
                mermaid: z.string(),
            }),
        )
        .max(3)
        .optional(),
    steps: z
        .array(
            z.object({
                title: z.string(),
                description: z.string(),
                hints: z.array(z.string()).optional(),
                filesInvolved: z.array(z.string()).optional(),
                dependsOn: z.array(z.number()).optional(),
                complexity: z.enum(['low', 'medium', 'high']).optional(),
            }),
        )
        .min(1)
        .max(25),
    risks: z.array(z.string()).optional(),
    successCriteria: z.array(z.string()).optional(),
})

const readOnlyTools = (executor: ToolExecutor) => {
    return {
        read_file: tool({
            description: "Read a text file from the workspace. Use a path relative to the project root.",
            inputSchema: z.object({
                path: z.string().describe("Relative file path.")
            }),
            execute: async ({ path: p }) => executor.readFile(p)
        }),

        list_files: tool({
            description: "List files and directories under a path.",
            inputSchema: z.object({
                path: z.string(),
                recursive: z.boolean().optional().default(false),
            }),
            execute: async ({ path: p, recursive }) =>
                executor.listFiles(p, recursive),
        }),

        search_files: tool({
            description:
                'Find files matching a glob pattern (e.g. **/*.ts, **/*.md). Optional content substring filter.',
            inputSchema: z.object({
                root: z.string().describe('Directory to search, relative to root'),
                pattern: z
                    .string()
                    .describe('Glob-like pattern using * and ** (forward slashes)'),
                content_contains: z.string().optional(),
            }),
            execute: async ({ root, pattern, content_contains }) =>
                executor.searchFiles(root, pattern, content_contains),
        }),

        analyze_codebase: tool({
            description:
                "Summarize structure: file counts, size, extensions. Read-only.",
            inputSchema: z.object({
                path: z.string().default("."),
            }),
            execute: async ({ path: p }) => executor.analyzeCodebase(p),
        }),

        list_skills: tool({
            description:
                "List absolute paths to SKILL.md files under configured skill directories (Cursor / Claude).",
            inputSchema: z.object({}),
            execute: async () => executor.listSkills(),
        }),

        read_skill: tool({
            description:
                "Read a SKILL.md file. Path must be absolute and under skill roots, or use a path returned by list_skills.",
            inputSchema: z.object({
                path: z.string(),
            }),
            execute: async ({ path: p }) => executor.readSkill(p),
        }),
    }
}


const PLAN_INSTRUCTIONS = (
    codebase: string,
    hasWeb: boolean
) =>
    [
        "You are a Plan-Mode planner: an expert software architect who produces a DESIGN DOCUMENT ONLY.",
        "You DO NOT modify files. You DO NOT run commands that change state. Nothing you output will ever be executed — it is read by a human as a plan.",
        `Workspace: ${codebase}`,
        "",
        "RESEARCH PHASE (do this before planning):",
        "- Use read-only tools (read, search, grep, list) to understand the relevant code: structure, conventions, existing patterns, and constraints.",
        "- Check for related configs, docs, or skills that define how work should be done in this repo.",
        hasWeb
            ? "- Web tools are available. Use them only when the task needs current info or external library/API docs not present in the codebase."
            : "- Web tools are unavailable because FIRECRAWL_API_KEY is not configured. Do not claim to have looked anything up online.",
        "- Never guess about code you have not actually inspected. Uncertain items go in 'assumptions', not stated as fact.",
        "",
        "PLANNING PHASE:",
        "- Break the goal into the fewest well-scoped steps that fully describe the procedure. Prefer fewer, meaningful steps over many trivial ones.",
        "- Each step is a written procedure (what to do and why), not actual code. Do not write implementation code, only describe it.",
        "- Each step must be concrete and independently verifiable — name the file/function/change, not just the goal restated.",
        "- Record real dependencies between steps via 'dependsOn' (zero-based indices into 'steps').",
        "- List files/modules likely to be touched in 'filesInvolved', based only on what you found in the RESEARCH PHASE.",
        "- Recommend a 'techStack': the technologies/libraries relevant to this goal (existing ones being used, and any new ones needed), each with a one-line 'purpose'.",
        "- Note genuine risks (breaking changes, ambiguous requirements, missing info); use [] if there are none.",
        "- Include 2-3 Mermaid diagrams in 'diagrams' if the plan's structure, flow, sequencing, or state transitions are easier to grasp visually (e.g. one architecture/component diagram, one flow or sequence diagram). Use [] for trivial/linear tasks where a diagram wouldn't add clarity — never force one in.",
        "",
        "IMPORTANT — OUTPUT CONTRACT:",
        "Return ONLY valid JSON. No Markdown. No headings. No ``` fences. No explanation before or after the JSON. No questions. Never ask 'Shall I proceed?'.",
        "Escape all string values properly (\\n for newlines, \\\" for quotes) so the output is directly JSON.parse-able.",
        "",
        "The response must match this structure exactly:",
        '{"title":"short plan title","researchSummary":"what you learned that is relevant to this plan","assumptions":["assumption"],"techStack":[{"name":"library/tool","purpose":"why it is used here"}],"diagrams":[{"title":"diagram title","mermaid":"mermaid diagram source"}],"steps":[{"title":"step title","description":"step description","hints":["hint"],"filesInvolved":["path/to/file"],"dependsOn":[0],"complexity":"low"}],"risks":["risk"],"successCriteria":["how to verify the plan is sound"]}',
        "",
        "FIELD RULES:",
        "- 'diagrams[].mermaid': valid Mermaid syntax only (flowchart, sequenceDiagram, classDiagram, stateDiagram-v2, or erDiagram — pick whichever fits). Cap at 3 diagrams; use [] when diagrams wouldn't add clarity.",
        "- 'assumptions', 'risks', 'successCriteria', 'filesInvolved', 'dependsOn', 'techStack', 'diagrams': always include the key; use [] when not applicable.",
        "- 'complexity': one of 'low', 'medium', 'high' only.",
        "",
        "Keep it short: 1-15 steps.",
    ].join("\n");

const extractJson = (text: string): unknown => {
    const cleaned = text.trim();

    // Try raw JSON first
    try {
        return JSON.parse(cleaned);
    } catch {
        // Continue
    }

    // Try JSON inside ```json ... ```
    const fenced = cleaned.match(
        /```(?:json)?\s*([\s\S]*?)\s*```/i
    );

    if (fenced?.[1]) {
        try {
            return JSON.parse(fenced[1].trim());
        } catch {
            // Continue
        }
    }

    // Find JSON object anywhere in the response
    const start = cleaned.indexOf("{");

    if (start === -1) {
        throw new Error(
            "Planner did not return JSON.\n\n" +
            `Model response:\n${text}`
        );
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < cleaned.length; i++) {
        const char = cleaned[i];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (char === "\\") {
            escaped = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            continue;
        }

        if (inString) continue;

        if (char === "{") {
            depth++;
        }

        if (char === "}") {
            depth--;

            if (depth === 0) {
                const candidate = cleaned.slice(start, i + 1);

                try {
                    return JSON.parse(candidate);
                } catch {
                    break;
                }
            }
        }
    }

    throw new Error(
        "Planner returned invalid JSON.\n\n" +
        `Model response:\n${text}`
    );
};

export const generatePlan = async (goal: string) => {
    try {
        const config = defaultAgentConfig();
        const tracker = new ActionTracker();
        const executor = new ToolExecutor(tracker, config);

        const hashWeb = !!process.env.FIRECRAWL_API_KEY;
        const tools = {
            ...readOnlyTools(executor),
            ...(hashWeb ? createWebTools(tracker) : {})
        };
        logInfo("\n🔍 Researching and drafting a plan ...\n");


        const result = streamText({
            model: getAgentModel(),
            tools,
            stopWhen: stepCountIs(20),
            system: PLAN_INSTRUCTIONS(config.codebasePath, hashWeb),
            prompt: `User goal: \n${goal}`,
            onStepFinish: ({ toolCalls }) => {           // 👈 ADD THIS
                for (const tc of toolCalls) {
                    const preview = JSON.stringify(tc?.input).slice(0, 160);
                    console.log(
                        chalk.green("  ✓"),
                        chalk.bold(String(tc?.toolName)),
                        chalk.dim(preview + (preview.length >= 160 ? "..." : "")),
                    );
                }
            },

        })

        let responseText = "";

        for await (const chunk of result.textStream) {
            responseText += chunk;
        }

        const parsed = extractJson(responseText);

        const validate = planSchema.parse(parsed);
        const steps: PlanStep[] = validate.steps.map((s, i) => ({
            id: `step-${i + 1}`,
            title: s.title,
            description: s.description,
            hints: s.hints,
            filesInvolved: s.filesInvolved,
            dependsOn: s.dependsOn,
            complexity: s.complexity,
        }))
        return {
            goal,
            title: validate.title,
            researchSummary: validate.researchSummary,
            assumptions: validate.assumptions,
            techStack: validate.techStack,
            diagrams: validate.diagrams,
            risks: validate.risks,
            successCriteria: validate.successCriteria,
            steps
        }
    } catch (error) {
        logError(error);
    }
}