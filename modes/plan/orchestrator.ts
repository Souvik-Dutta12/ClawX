import chalk from "chalk";
import { confirm, isCancel, text } from "@clack/prompts";
import { ToolLoopAgent, stepCountIs } from "ai";
import { getAgentModel } from "../../ai/ai.config.ts";
import { ActionTracker } from "../agent/action-tracker.ts";
import { ToolExecutor } from "../agent/tool-executer.ts";
import { createAgentTools } from "../agent/agent-tools.ts";
import { defaultAgentConfig } from "../agent/types.ts";
import { runApprovalFlow } from "../agent/approval.ts";
import { renderTerminalMarkdown } from "../../tui/terminal-md.ts";
import { generatePlan } from "./planner.ts";
import { printPlan, selectSteps } from "./selection.ts";
import type { Plan, PlanStep } from "./types.ts";
import { createWebTools } from "./web-tools.ts";

function stepPrompt(goal: string, step: PlanStep): string {
    return [`Goal: ${goal}`, `Step: ${step.title}`, step.description].join('\n');
}


const asMd = (plan: Plan): string => {
    const parts: string[] = [];
    parts.push(`# Plan\n`);
    parts.push(`## Goal\n\n${plan.goal.trim()}\n`);
    if (plan.researchSummary?.trim()) {
        parts.push(`\n## Research Summary\n\n${plan.researchSummary.trim()}\n`);
    }
    parts.push(`\n## Steps\n`);
    for (const [i, s] of plan.steps.entries()) {
        const complexity = s.complexity ? ` [${s.complexity}]` : '';
        parts.push(`\n### Step ${i + 1}. ${s.title}${complexity}\n`);
        parts.push(`${s.description}\n`);
        if (s.hints?.length) {
            parts.push(`\nHints:\n`);
            for (const h of s.hints) parts.push(`- ${h}\n`);
        }
    }
    return parts.join('');
};

export const runPlanMode = async (): Promise<void> => {
    console.log(chalk.bold('\n📄 Plan Mode\n'));

    const goal = await text({ message: "What is your goal?" })
    if (isCancel(goal) || !goal.trim()) return;

    const plan = await generatePlan(goal);
    printPlan(plan);

    const selected = await selectSteps(plan);
    if (selected.length === 0) return;

    // Create executor early so we can use it for saving the plan
    const config = defaultAgentConfig();
    config.tools.allowFileCreation = true;
    config.tools.allowFileModification = false;
    config.tools.allowFolderCreation = false;
    config.tools.allowShellExecution = false;

    const tracker = new ActionTracker();
    const executor = new ToolExecutor(tracker, config);


    const proceed = await confirm({
        message: `Execute ${selected.length} step(s)`,
        initialValue: true
    });
    if (isCancel(proceed) || !proceed) return;

    const tools = {
        ...createAgentTools(executor),
        ...createWebTools(tracker)
    }

    for (const step of selected) {
        console.log(chalk.bold(`\n🔧 ${step.title}\n`));

        const agent = new ToolLoopAgent({
            model: getAgentModel(),
            stopWhen: stepCountIs(30),
            tools
        });

        const result = await agent.generate({ prompt: stepPrompt(plan.goal, step) })
        if (result.text) {

            console.log(renderTerminalMarkdown(result.text))
            
            // Ask to save the plan to a .md file (mirrors Ask Mode's pattern)
            const wantSave = await confirm({
                message: "Save this plan to a .md file in the current directory ?",
                initialValue: false,
            });

            if (!isCancel(wantSave) && wantSave) {
                const fileName = await text({
                    message: "Filename",
                    initialValue: "plan.md",
                    validate: (v) => {
                        const s = (v ?? '').trim();
                        if (!s) return 'Required';
                        if (s.includes('..') || s.includes('/') || s.includes('\\')) return 'No paths';
                        if (!s.toLowerCase().endsWith('.md')) return 'Must end with .md';
                    }
                });

                if (!isCancel(fileName)) {
                    executor.createFile(fileName, asMd(plan));
                    const ok = await runApprovalFlow(tracker);
                    if (!ok) {
                        executor.clearStaging();
                        return;
                    }
                    executor.applyApprovedFromTracker();
                    executor.clearStaging();
                }
            }
            return 
        }
    }

    const ok = await runApprovalFlow(tracker);

    if (!ok) return executor.clearStaging();

    const { errors } = executor.applyApprovedFromTracker();

    if (errors.length) {
        console.log(chalk.red('\nSome operations reported errors:\n'));
        for (const e of errors) console.log(chalk.red(`  • ${e}`));
    } else {
        console.log(chalk.green('\n✓ Applied.\n'));
    }

    executor.clearStaging();

}
