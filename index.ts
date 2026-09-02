#!/usr/bin/env node

import { Command } from "commander";
import { runWakeup } from "./tui/wakeup.ts";
import { safeCall, setupGlobalErrorHandlers } from "./utils/index.ts";

setupGlobalErrorHandlers();

const program = new Command();

program
    .name("clawx-build")
    .description("clawx cli yt")
    .version("0.0.1");

program
    .command("wakeup")
    .description("Show the banner and pick cli or telegram mode")
    .action(async () => {
        await safeCall(async () => {
            await runWakeup();
        }, { exitOnError: true });
    });

await program.parseAsync(process.argv)