// src/utils/telegram.ts
export const clip = (text: string, max = 4000) =>
  text.length < max ? text.slice(0, max) : text.slice(0, max) + '\n...[truncated]';

export const replyMd = (ctx: { reply: (text: string, opts?: object) => Promise<unknown> }, text: string) =>
  ctx.reply(clip(text), { parse_mode: 'Markdown' });

//export function /name
export function commandArg(fullText: string, name: string): string {
  return fullText.replace(new RegExp(`^/${name}\\s*`, 'i'), '').trim();
}