# ClawX

<div align="center">

![ClawX Banner](https://img.shields.io/badge/ClawX-AI%20Agent-blue?style=for-the-badge)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**An intelligent AI agent that gives you insight into your codebase and manipulates it with your permission.**

</div>

---

## ✨ Features

- 🤖 **AI-Powered Analysis** - Leverage LLMs via OpenRouter to understand and modify your codebase
- 🔒 **Safe Mutations** - All changes are staged and require explicit approval before applying
- 📊 **Codebase Intelligence** - Analyze project structure, search files, and explore code
- 🌐 **Web Research** - Search the web to gather information for planning
- 📝 **Plan Generation** - Generate detailed implementation plans with Mermaid diagrams
- 💬 **Multiple Interfaces** - Use via CLI or Telegram bot
- 🎨 **Beautiful UI** - ASCII art banners and terminal-friendly markdown rendering

---

## 🚀 Modes

### CLI Mode

| Mode | Description |
|------|-------------|
| **Agent Mode** | Execute code mutations on your codebase with a smart approval workflow. The agent can read, write, modify, and delete files with your permission. |
| **Plan Mode** | Generate comprehensive implementation plans. Creates design documents with steps, risks, tech stack analysis, and Mermaid diagrams. |
| **Ask Mode** | Query your codebase using natural language. Get answers with file context and web search capabilities. |

### Telegram Mode

Control ClawX directly from Telegram. Send commands and receive responses just like in the CLI.

---

## 🛠️ Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm**, **npm**, **yarn**, or **bun**
- **OpenRouter API Key** - Get one at [openrouter.ai](https://openrouter.ai)

### Setup

```bash
# Clone the repository
git clone https://github.com/Souvik-Dutta12/ClawX.git
cd ClawX

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_DEFAULT_MODEL=your_preferred_model  # e.g., anthropic/claude-3.5-sonnet

# Optional: Telegram bot configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

---

## 📖 Usage

### Start ClawX

```bash
pnpm dev
```

### CLI Mode

#### Agent Mode
```
What would you like the agent to do?
> Create a new component called UserProfile in the components folder
```

The agent will:
1. Analyze your codebase
2. Propose file changes
3. Show you a diff of proposed changes
4. Wait for your approval before applying

#### Plan Mode
```
What is your goal?
> Build a user authentication system with JWT
```

Generates a comprehensive plan including:
- Implementation steps
- Files likely to be involved
- Tech stack recommendations
- Risk assessment
- Success criteria

#### Ask Mode
```
What do you want to ask?
> How does the authentication flow work in this project?
```

Gets intelligent answers with file references and saves to markdown.

---

## 🏗️ Project Structure

```
ClawX/
├── ai/                    # AI configuration and model setup
│   └── ai.config.ts       # OpenRouter model configuration
├── modes/                 # Application modes
│   ├── agent/            # Agent mode implementation
│   │   ├── orchestrator.ts
│   │   ├── tool-executer.ts
│   │   ├── approval.ts
│   │   ├── action-tracker.ts
│   │   ├── diff-view.ts
│   │   └── agent-tools.ts
│   ├── ask/              # Ask mode implementation
│   ├── plan/             # Plan mode implementation
│   │   ├── planner.ts
│   │   ├── web-tools.ts
│   │   └── selection.ts
│   ├── cli.ts            # CLI mode selector
│   └── telegram/         # Telegram bot integration
├── tui/                   # Terminal UI components
│   ├── wakeup.ts         # Banner and mode selection
│   └── terminal-md.ts    # Markdown rendering
├── utils/                 # Utility functions
├── index.ts              # Entry point
└── package.json
```

---

## 🔧 Tools Available

### File Operations
| Tool | Description |
|------|-------------|
| `read_file` | Read a text file from the workspace |
| `create_file` | Create a new file |
| `modify_file` | Replace entire file content |
| `delete_file` | Delete a file |
| `list_files` | List files and directories |
| `search_files` | Find files by glob pattern or content |
| `create_folder` | Create a directory tree |

### Analysis
| Tool | Description |
|------|-------------|
| `analyze_codebase` | Summarize project structure |
| `list_skills` | List available SKILL.md files |
| `read_skill` | Read a skill file |

### External
| Tool | Description |
|------|-------------|
| `execute_shell` | Run shell commands (requires approval) |
| Web Search | Search the web for information |

---

## ⚙️ Configuration

### Agent Configuration

Edit `modes/agent/types.ts` to customize:

```typescript
{
  codebasePath: ".",           // Project root
  maxIterations: 40,           // Max LLM iterations
  tools: {
    allowFileCreation: true,
    allowFileModification: true,
    allowFileDeletion: true,
    allowFolderCreation: true,
    allowShellExecution: true  // Requires extra approval
  }
}
```

### Models

Configure your preferred model in `.env`:

```env
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_DEFAULT_MODEL=openai/gpt-4-turbo
OPENROUTER_DEFAULT_MODEL=google/gemini-pro
```

---

## 📋 Approval Workflow

ClawX uses a staged mutation system:

1. **Staged** → All changes are prepared but not applied
2. **Review** → See diffs and descriptions of each change
3. **Approved** → Apply selected changes
4. **Applied** → Changes are written to disk

This ensures you always have control over what happens to your codebase.

---

## 🎯 Examples

### Example 1: Create a Component

```
User: Create a Button component with hover effects

ClawX:
├── Staging: src/components/Button.tsx
├── + export const Button = ({ children, onClick }) => (
│   +   <button onClick={onClick} className="btn btn-hover">
│   +     {children}
│   +   </button>
│   + )
│   + )
│   + <style> .btn-hover:hover { opacity: 0.8; } </style>
├── [A]pprove all? [y/n]:
```

### Example 2: Generate a Plan

```
User: Build a REST API for a blog

ClawX:
# Blog REST API Plan

## Tech Stack
- Express.js — Web framework
- Prisma — ORM

## Steps
1. Set up Express server with routes
2. Configure Prisma schema
3. Implement CRUD endpoints
...

[Plan saved to plan.md]
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Vercel AI SDK](https://ai.sdk.vercel.sh/)
- UI Components by [@clack/prompts](https://github.com/natemoo-re/clack)
- Powered by [OpenRouter](https://openrouter.ai/)

---

<div align="center">

**Made with ❤️ for developers who want AI assistance without losing control**

</div>
