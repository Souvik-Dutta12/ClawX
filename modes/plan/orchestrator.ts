import chalk from "chalk";
import { confirm, isCancel, text } from "@clack/prompts";
import { ActionTracker } from "../agent/action-tracker.ts";
import { ToolExecutor } from "../agent/tool-executer.ts";
import { defaultAgentConfig } from "../agent/types.ts";
import { runApprovalFlow } from "../agent/approval.ts";
import { generatePlan } from "./planner.ts";
import { printPlan, selectSteps } from "./selection.ts";
import type { Plan } from "./types.ts";
import { logError, logInfo, logSuccess, logWarning } from "../../utils/error.ts";

const asMd = (plan: Plan): string => {
    const parts: string[] = [];

    parts.push(`# ${plan.title?.trim() || 'Plan'}\n`);
    parts.push(`## Goal\n\n${plan.goal.trim()}\n`);

    if (plan.researchSummary?.trim()) {
        parts.push(`\n## Research Summary\n\n${plan.researchSummary.trim()}\n`);
    }

    if (plan.techStack?.length) {
        parts.push(`\n## Tech Stack\n`);
        for (const t of plan.techStack) {
            parts.push(`- **${t.name}**${t.purpose ? ` — ${t.purpose}` : ''}\n`);
        }
    }

    if (plan.diagrams?.length) {
        parts.push(`\n## Diagrams\n`);
        for (const d of plan.diagrams) {
            parts.push(`\n### ${d.title}\n`);
            parts.push('\n```mermaid\n' + d.mermaid.trim() + '\n```\n');
        }
    }

    if (plan.assumptions?.length) {
        parts.push(`\n## Assumptions\n`);
        for (const a of plan.assumptions) parts.push(`- ${a}\n`);
    }

    parts.push(`\n## Implementation Procedure\n`);
    for (const [i, s] of plan.steps.entries()) {
        const complexity = s.complexity ? ` [${s.complexity}]` : '';
        parts.push(`\n### Step ${i + 1}. ${s.title}${complexity}\n`);
        parts.push(`${s.description}\n`);
        if (s.filesInvolved?.length) {
            parts.push(`\nLikely files:\n`);
            for (const f of s.filesInvolved) parts.push(`- \`${f}\`\n`);
        }
        if (s.hints?.length) {
            parts.push(`\nHints:\n`);
            for (const h of s.hints) parts.push(`- ${h}\n`);
        }
    }

    if (plan.risks?.length) {
        parts.push(`\n## Risks\n`);
        for (const r of plan.risks) parts.push(`- ${r}\n`);
    }

    if (plan.successCriteria?.length) {
        parts.push(`\n## Success Criteria\n`);
        for (const c of plan.successCriteria) parts.push(`- ${c}\n`);
    }

    return parts.join('');
};

export const runPlanMode = async (): Promise<void> => {
    try {
        logInfo('\n📄 Plan Mode\n');
        logWarning('Plan Mode only produces a design document (plan.md). It never writes or executes project code.');

        const goal = await text({ message: "What is your goal?" });
        if (isCancel(goal) || !goal.trim()) return;

        const plan = await generatePlan(goal);
        printPlan(plan);

        const selected = await selectSteps(plan);
        if (selected.length === 0) return;

        const finalPlan: Plan = { ...plan, steps: selected };

        const wantSave = await confirm({
            message: "Save this plan to a .md file?",
            initialValue: true,
        });
        if (isCancel(wantSave) || !wantSave) return;

        const fileName = await text({
            message: "Filename",
            initialValue: "plan.md",
            validate: (v) => {
                const s = (v ?? '').trim();
                if (!s) return 'Required';
                if (s.includes('..') || s.includes('/') || s.includes('\\')) return 'No paths';
                if (!s.toLowerCase().endsWith('.md')) return 'Must end with .md';
            },
        });
        if (isCancel(fileName)) return;

        const config = defaultAgentConfig();
        config.tools.allowFileCreation = true;
        config.tools.allowFileModification = false;
        config.tools.allowFolderCreation = false;
        config.tools.allowShellExecution = false;

        const tracker = new ActionTracker();
        const executor = new ToolExecutor(tracker, config);

        executor.createFile(fileName, asMd(finalPlan));

        const ok = await runApprovalFlow(tracker);
        if (!ok) {
            executor.clearStaging();
            return;

        }

        const { errors } = executor.applyApprovedFromTracker();
        executor.clearStaging();

        if (errors.length) {
            logError('\nSome operations reported errors:\n');
            for (const e of errors) logError(`  • ${e}`);
        } else {
            logSuccess(`✓ Plan saved to ${fileName}`);
        }
    } catch (error) {
        logError(error);
    }
};