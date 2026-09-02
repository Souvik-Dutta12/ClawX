// utils/errors.ts
import chalk from "chalk";

export class AppError extends Error {
  public code?: string;
  public details?: string;

  constructor(
      message: string,
      code?: string,
      details?: string
  ) {
      super(message);

      this.name = "AppError";
      this.code = code;
      this.details = details;
  }
}

export const ErrorFormatter = {
  /**
   * Format an error with a clean, readable style
   */
  format(error: unknown): string {
    if (error instanceof AppError) {
      return this.formatAppError(error);
    }
    
    if (error instanceof Error) {
      return this.formatGenericError(error);
    }
    
    return this.formatUnknownError(error);
  },

  formatAppError(error: AppError): string {
    const lines = [
      (error.code ? chalk.gray(` [${error.code}]`) : ""),
      "",
      `  ${chalk.white(error.message)}`,
    ];
    
    if (error.details) {
      lines.push(chalk.dim(`  ${error.details}`));
    }
    
    return lines.join("\n");
  },

  formatGenericError(error: Error): string {
    const hasStack = error.stack && error.stack.split("\n").length > 2;
    
    return [
      "",
      `  ${chalk.white(error.message)}`,
      hasStack ? "" : "",
      hasStack ? chalk.dim(`  ${error.stack!.split("\n").slice(1, 3).join("\n  ")}`) : "",
    ].filter(Boolean).join("\n");
  },

  formatUnknownError(error: unknown): string {
    return [
      chalk.red.bold("Unexpected Error"),
      "",
      `  ${chalk.white(String(error))}`,
    ].join("\n");
  }
};

/**
 * Log a formatted error to console
 */
export function logError(error: unknown): void {
  console.error(chalk.red.bold(`\n❌ Error\n  ${ErrorFormatter.format(error)} \n`) );
}

/**
 * Log a warning in yellow
 */
export function logWarning(message: string): void {
  console.log(chalk.yellow.bold(`⚠ Warning [${message}]\n`));
}

/**
 * Log success in green
 */
export function logSuccess(message: string): void {
  console.log(chalk.green.bold(`✓ Success [${message}]\n`) );
}

/**
 * Log info in blue
 */
export function logInfo(message: string): void {
  console.log(chalk.blue.bold(` ${message}\n`) );
}
