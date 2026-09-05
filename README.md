# ClawX

<div align="center">

![ClawX Banner](https://img.shields.io/badge/ClawX-AI%20Agent-blue?style=for-the-badge)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**An AI agent that gives you insight into your codebase and manipulates it with your permission.**

</div>

---

## ✨ Features

- 🤖 **AI-Powered Analysis** — uses an LLM (via OpenRouter) to read, reason about, and modify your codebase
- 🔒 **Safe Mutations** — every file change is *staged* first and only written to disk after you approve it
- 📊 **Codebase Intelligence** — list/search files, analyze project structure, read skill files
- 🌐 **Web Research** — optional Firecrawl-powered web search for Ask/Plan modes
- 📝 **Plan Generation** — generate step-by-step implementation plans
- 💬 **Two Interfaces** — interactive CLI or a Telegram bot
- 🎨 **Terminal UI** — ASCII banner + terminal-rendered Markdown output

---

## 🚀 Modes

Running the CLI drops you into a menu (`wakeup`) where you choose **CLI** or **Telegram**. CLI mode then offers three sub-modes:

| Mode | File | Description |
|------|------|-------------|
| **Agent Mode** | `modes/agent/orchestrator.ts` | Reads/creates/modifies/deletes files and runs shell commands, all staged behind an approval step. |
| **Plan Mode** | `modes/plan/orchestrator.ts` | Generates an implementation plan for a stated goal (optionally backed by web research). |
| **Ask Mode** | `modes/ask/orchestrator.ts` | Answers natural-language questions about the codebase. |

**Telegram Mode** (`modes/telegram/`) exposes the same three capabilities as bot commands (`/agent`, `/plan`, `/ask`) restricted to a single owner chat ID, with inline-button approval for staged changes.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js, TypeScript (`type: module`)
- **AI:** [Vercel AI SDK](https://ai.sdk.vercel.sh/) (`ai`) + [`@openrouter/ai-sdk-provider`](https://openrouter.ai/)
- **CLI UI:** `@clack/prompts`, `chalk`, `figlet`
- **Bot:** `telegraf`
- **Web research:** `@mendable/firecrawl-js`
- **Other:** `commander` (CLI entry), `dotenv`, `diff`, `marked` + `marked-terminal`

---

## 📦 Prerequisites

- **Node.js** v18+
- A package manager: **npm**, **pnpm**, **yarn**, or **bun**
- An **OpenRouter API key** — [get one here](https://openrouter.ai)

---

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/Souvik-Dutta12/ClawX.git
cd ClawX

# Install dependencies
npm install
# or: pnpm install / yarn / bun install
```

---

## ⚙️ How to Use — Filling the `.env` File

ClawX reads its configuration from a `.env` file in the project root (loaded via `dotenv` from `ai/ai.config.ts`). Create it like this:

```bash
cp .env.example .env   # if a .env.example exists, otherwise just create .env
```

Then fill in the following values:

```env
# --- Required ---
# Your OpenRouter API key (used to call the LLM)
OPENROUTER_API_KEY=sk-or-your-key-here

# The model ClawX should use for every mode
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet

# --- Optional: Telegram bot mode ---
# Bot token from @BotFather
TELEGRAM_BOT_TOKEN=123456789:your-telegram-bot-token

# Your personal Telegram chat/user ID — only this ID can command the bot
TELEGRAM_OWNER_ID=123456789

# --- Optional: Web research (Plan Mode / Ask Mode) ---
# Enables Firecrawl-based web search tools when set
FIRECRAWL_API_KEY=fc-your-firecrawl-key

# --- Optional: advanced ---
# Override the project root the agent operates on (defaults to the current working directory)
CODEBASE_PATH=.

# Extra SKILL.md directories to expose to the agent, separated by ";"
SKILL_DIRS=/path/to/skills;/another/path
```

| Variable | Required | Used for |
|---|---|---|
| `OPENROUTER_API_KEY` | ✅ Yes | Authenticating with OpenRouter to run the LLM |
| `OPENROUTER_DEFAULT_MODEL` | ✅ Yes | Which model ID to use (e.g. `anthropic/claude-3.5-sonnet`, `openai/gpt-4-turbo`) |
| `TELEGRAM_BOT_TOKEN` | Only for Telegram mode | Authenticates the bot with the Telegram API |
| `TELEGRAM_OWNER_ID` | Only for Telegram mode | Restricts all bot commands to this chat ID |
| `FIRECRAWL_API_KEY` | Optional | Turns on web-search tools in Plan/Ask mode |
| `CODEBASE_PATH` | Optional | Root folder the agent reads/writes (default: `.`) |
| `SKILL_DIRS` | Optional | Extra directories to scan for `SKILL.md` files |

> **Note:** the code that enables web search checks `FIRECRAWL_API_KEY`, but the Firecrawl client itself is currently instantiated with `process.env.FIRECRAWL_AP_KEY` (missing the "I") in `modes/plan/web-tools.ts`. Until that's fixed, set **both** `FIRECRAWL_API_KEY` and `FIRECRAWL_AP_KEY` to the same value if you want web research to actually work.

Never commit your `.env` file — it's already listed in `.gitignore`.

---

## ▶️ Running ClawX

**Option A — quick start with `tsx` (no build step):**
```bash
npx tsx index.ts wakeup
```

**Option B — compile then run:**
```bash
npm run build      # runs tsc, outputs to dist/
node dist/index.js wakeup
```

**Option C — install as a global command:**
```bash
npm link            # or: npm install -g .
clawx-build wakeup
```

Once running, `wakeup` shows the banner and asks you to choose **CLI** or **Telegram**. In CLI mode you then pick **Agent**, **Plan**, or **Ask**.

> `npm run dev` runs `tsc --watch` — it type-checks the project on save but does not start the app. Use one of the options above to actually run it.

### Example — Agent Mode
```
What would you like the agent to do?
> Create a new component called UserProfile in the components folder
```
The agent reads the codebase, stages the file changes, shows you a diff, and waits for your approval before writing anything.

### Example — Ask Mode
```
What do you want to ask?
> How does the authentication flow work in this project?
```

### Example — Telegram Mode
Once `TELEGRAM_BOT_TOKEN` and `TELEGRAM_OWNER_ID` are set, message your bot:
```
/agent Create a Button component with hover effects
/plan Build a REST API for a blog
/ask How does auth work here?
```

---

## 🏗️ Project Structure

```
ClawX/
├── ai/
│   ├── ai.config.ts        # OpenRouter model + dotenv setup
│   └── index.ts
├── modes/
│   ├── agent/               # Agent mode (mutations + approval)
│   │   ├── orchestrator.ts
│   │   ├── tool-executer.ts
│   │   ├── agent-tools.ts
│   │   ├── approval.ts
│   │   ├── action-tracker.ts
│   │   ├── diff-view.ts
│   │   └── types.ts
│   ├── ask/
│   │   └── orchestrator.ts  # Ask mode
│   ├── plan/                # Plan mode
│   │   ├── orchestrator.ts
│   │   ├── planner.ts
│   │   ├── selection.ts
│   │   ├── web-tools.ts     # Firecrawl integration
│   │   └── types.ts
│   ├── telegram/            # Telegram bot integration
│   │   ├── index.ts
│   │   ├── handlers.ts
│   │   ├── agent-run.ts
│   │   ├── approval-session.ts
│   │   ├── plan-session.ts
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   └── text.ts
│   └── cli.ts                # CLI sub-mode selector
├── tui/
│   ├── wakeup.ts             # Banner + CLI/Telegram picker
│   └── terminal-md.ts        # Terminal Markdown rendering
├── utils/
│   ├── error.ts
│   └── index.ts
├── index.ts                  # CLI entry point (commander)
├── tsconfig.json
└── package.json
```

---

## 🧰 Tools Available to the Agent

### File Operations
| Tool | Description |
|------|-------------|
| `read_file` | Read a text file |
| `create_file` | Stage creation of a new file |
| `modify_file` | Stage a full-file replacement |
| `delete_file` | Stage deletion of a file |
| `create_folder` | Stage creation of a directory tree |
| `list_files` | List files/directories under a path |
| `search_files` | Find files by glob pattern and/or content substring |

### Analysis
| Tool | Description |
|------|-------------|
| `analyze_codebase` | Summarize file counts, sizes, extensions (read-only) |
| `list_skills` | List available `SKILL.md` files |
| `read_skill` | Read a specific skill file |

### External
| Tool | Description |
|------|-------------|
| `execute_shell` | Queue a shell command, run only after approval |
| Web search (Plan/Ask) | Firecrawl-backed research, enabled when `FIRECRAWL_API_KEY` is set |

---

## 📋 Approval Workflow

All mutating actions go through the same lifecycle:

1. **Staged** — the agent proposes a change, nothing is written yet
2. **Review** — you see a diff of what would change
3. **Approve / Reject** — accept all, or reject and discard
4. **Applied** — approved changes are written to disk

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

---

## 📄 License

ISC — see `package.json` for details.

---

## 🙏 Acknowledgments

- Built with the [Vercel AI SDK](https://ai.sdk.vercel.sh/)
- UI via [@clack/prompts](https://github.com/natemoo-re/clack)
- LLM access via [OpenRouter](https://openrouter.ai/)
- Web research via [Firecrawl](https://www.firecrawl.dev/)

<div align="center">

**Made by Souvik Dutta**

</div>