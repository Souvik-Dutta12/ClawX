import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";
import { runCliMode } from "../modes/cli.ts";

const BANNER_FONT = 'ANSI Shadow';
const SHADOW = chalk.hex('#e8dcf8');
const FACE = chalk.hex('#2563EB').bold;

function printBannerWithShadow(ascii: string) {
  const bannerLines = ascii.split('\n');
  const maxLen = Math.max(...bannerLines.map((l) => l.length), 0);
  const rowWidth = maxLen + 1;

  for (const line of bannerLines) {
    console.log(SHADOW(line.padEnd(rowWidth)));
  }
  process.stdout.write(`\x1b[${bannerLines.length}A`);
  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }
  console.log();
}

export const runWakeup = async () => {
    let ascii:string;
    try {
        ascii = figlet.textSync("clawx",{font:BANNER_FONT})
    } catch (error) {
        ascii = figlet.textSync("clawx", {font:"Standard"})
    }

    printBannerWithShadow(ascii)

    const mode = await select({
        message: "which mode you want to proceed with?",
        options: [
            {value: "cli", label: "CLI"},
            {value: "telegram", label: "Telegram"},
            {value: "exit", label:"Exit"}
        ]
    });

    if(isCancel(mode || mode === "exit")){
        console.log(chalk.dim("\n Goodbye. \n"));
        return;
    }
    if(mode === "cli"){
        await runCliMode()
    }else if(mode === "telegram"){
        console.log(chalk.dim("starting telegram mode..."))
    }
}