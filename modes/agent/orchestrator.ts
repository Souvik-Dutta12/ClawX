import { isCancel, text } from "@clack/prompts";
import chalk from "chalk"
import { defaultAgentConfig } from "./types.ts";
import { ActionTracker } from "./action-tracker.ts";
import { ToolExecutor } from "./tool-executer.ts";
import { createAgentTools } from "./agent-tools.ts";
import { stepCountIs, streamText } from "ai";
import { getAgentModel } from "../../ai/ai.config.ts";
import { renderTerminalMarkdown } from "../../tui/terminal-md.ts";
import { runApprovalFlow } from "./approval.ts";
import { logError, logInfo, logSuccess } from "../../utils/error.ts";

export const runAgentMode = async () => {
    try {
        logInfo('\n🤖 Agent Mode\n');

        const goal = await text({
            message: "What would you like the agent to do?",
            placeholder: "Concrete task for this codebase..."
        });

        if (isCancel(goal) || !goal.trim()) return;

        const config = defaultAgentConfig();
        const tracker = new ActionTracker();
        const executor = new ToolExecutor(tracker, config);
        const tools = createAgentTools(executor);


        const result = streamText({
            model: getAgentModel(),
            system: [
                `Workspace root: ${config.codebasePath}`,
                'All mutations are staged until approved.',
            ].join("\n"),
            prompt: goal.trim(),
            tools,
            stopWhen: stepCountIs(40),

            onStepFinish: ({ toolCalls }) => {
                for (const tc of toolCalls) {
                    const preview = JSON.stringify(tc.input).slice(0, 160);

                    console.log(
                        chalk.green("  ✓"),
                        chalk.bold(String(tc.toolName)),
                        chalk.dim(
                            preview + (preview.length >= 160 ? "..." : "")
                        ),
                    );
                }
            },
        });

        let answer = "";

        process.stdout.write("\n");

        for await (const chunk of result.textStream) {
            answer += chunk;
            process.stdout.write(chunk);
        }

        process.stdout.write("\n\n");

        if (answer.trim()) {
            console.log(renderTerminalMarkdown(answer));
        }

        const ok = await runApprovalFlow(tracker);
        if (!ok) return executor.clearStaging();

        const { errors } = executor.applyApprovedFromTracker();
        if (errors.length) {
            console.log(chalk.red("\nSome operations reported errors:\n"));
            for (const e of errors) console.log(chalk.red(`   • ${e}`));
        } else {
            console.log(chalk.green('\n✓ Applied.\n'));
        }
        executor.clearStaging()
            
    } catch (error) {
        logError(error);
    }
}