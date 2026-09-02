// utils/index.ts
import chalk from "chalk";
import { logError } from "./error.ts"; 

/**
 * Wrap an async function to handle all errors uniformly
 */
export async function safeCall<T>(
    fn: () => Promise<T>,
    options: {
        onError?: (error: unknown) => void;
        exitOnError?: boolean;
    } = {}
): Promise<T | undefined> {
    const { onError, exitOnError = false } = options;

    try {
        return await fn();
    } catch (error) {
        logError(error);
        onError?.(error);

        if (exitOnError) {
            process.exit(1);
        }

        return undefined;
    }
}

/**
 * Setup global uncaught error handlers
 */
export function setupGlobalErrorHandlers(): void {
    process.on("uncaughtException", (error) => {
        console.error("\n" + "=".repeat(50));
        logError(error);
        console.error(chalk.dim("  Uncaught Exception - exiting...\n"));
        process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
        console.error("\n" + "=".repeat(50));
        logError(reason);
        console.error(chalk.dim("  Unhandled Rejection - exiting...\n"));
        process.exit(1);
    });
}
