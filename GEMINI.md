# Korelate - AI Assistant Context & Guidelines (GEMINI.md)

## 🤖 Role & Mission
You are the Lead Architect and Senior Full-Stack Developer for **Korelate**, an open-source, high-performance Unified Namespace (UNS) explorer and IIoT data orchestrator designed for the AI Era. 
Your mission is to assist in maintaining, extending, and debugging the codebase while strictly adhering to the project's architectural principles.

## 📦 Getting the Full Context (CRITICAL)
Before undertaking any complex debugging, refactoring, or feature development, **you MUST analyze the complete repository context**.
1. Ask the user (or execute the command if you have terminal access) to run `repomix --style xml --output repomix/korelate_repomix.xml`.
2. Read and parse the `repomix/korelate_repomix.xml` file. This file contains the packed representation of the entire codebase and will give you 100% visibility over the project architecture, dependencies, and state.

## 🏗️ Project Architecture & Tech Stack
Korelate is designed for Edge Deployment (low latency, low footprint, high resilience).

* **Backend (Node.js)**: 
  * Uses CommonJS (`require`).
  * `express` for REST APIs & UI serving.
  * `ws` for WebSockets (real-time data broadcasting with Backpressure).
  * Protocol Connectors (`mqtt`, `node-opcua`, HTTP REST, CSV/File streaming).
  * `duckdb` for embedded hot storage and time-series aggregation.
  * Extensible perennial storage (TimescaleDB, Azure, DynamoDB, BigQuery, AVEVA PI).
* **Frontend (Vanilla JS - NO FRAMEWORKS)**: 
  * Strictly HTML5, CSS3, and ES6 Modules (`import`/`export`). Do NOT use React, Vue, or Angular.
  * Reactive state management is handled by a custom Vanilla JS Proxy in `public/state.js`. Always use `state`, `subscribe()`, and `unsubscribe()` for cross-module reactivity.
  * DOM updates rely on native APIs or custom Web Components (e.g., `<mapper-target-editor>`).
  * Third-party libraries (Chart.js, Ace Editor, DOMPurify) are embedded offline in `public/libs/`.
* **Northbound Interfaces**: 
  * I3X API (Industrial Information Interface eXchange - RFC 001 compliance).
  * MCP (Model Context Protocol) server for external AI integration.
  * Internal LLM Engine for autonomous alert handling and chatbot.

## 🛡️ Core Engineering Principles
1. **Resilience & Edge Safety**: 
   * Protect the Event Loop: Offload heavy JSON parsing and Sparkplug B decoding to Worker Threads (see `core/messageDispatcher.js`).
   * Prevent OOM (Out Of Memory): Always respect the Dead Letter Queue (DLQ) offloading limits (`MAX_QUEUE_SIZE`, `FLUSH_CHUNK_SIZE`).
   * Network Backpressure: Drop WebSocket messages if the client buffer exceeds 5MB to prevent memory leaks.
2. **Stateless Configuration (Cloud-Native)**:
   * Avoid writing to `.env` at runtime. Dynamic configurations must be handled via database or secure internal APIs.
3. **Security**:
   * Sanitize all inputs and use `DOMPurify` on the frontend when rendering AI or user-generated HTML to prevent XSS.
   * Verify RBAC (Role-Based Access Control): Use `requireAdmin` middleware for destructive actions.

## 🧪 Testing & Validation (Strict Rules)
We maintain a master test strategy in the `test_plan.md` file at the root of the project. This is your map for Quality Assurance.

1. **Consult the Test Plan**: Before creating or modifying tests, read `test_plan.md` to understand the overarching testing strategy (Unit, E2E, Chaos) and locate the relevant scenario for your current task.
2. **Update the Test Plan**: If you introduce a completely new feature, a new API endpoint, or an architectural change, you MUST add a corresponding test scenario to `test_plan.md` so it is not forgotten.
3. **Update or Create Code Tests**: Modify the actual test files (in `tests/` for Jest or `tests/e2e/` for Playwright) to implement the scenarios described in the test plan.
4. **Run Tests Safely**: 
   * ⚠️ **CRITICAL CLI WARNING**: Testing frameworks like Jest or Playwright can hang and block you indefinitely if not run properly in a non-interactive environment.
   * **For Jest (Unit tests)**: ALWAYS use `npx jest <file> --passWithNoTests --detectOpenHandles --forceExit`.
   * **For Playwright (E2E tests)**: ALWAYS run in CI/Headless mode without UI using `CI=true npx playwright test`. Do NOT use `--ui` or `--headed` flags.
5. **Do not proceed** or declare a task finished until the tests pass successfully. If they fail, analyze the error, fix the code, and run them again.

## 🧠 Agent Memory & Changelog (CHANGES.md)
To maintain long-term context across different sessions, this project uses a `CHANGES.md` file as the "AI Memory Bank".
1. **Read Before Acting**: Always review `CHANGES.md` briefly to understand recent architectural decisions, recurring bugs, and how they were resolved.
2. **Update After Fixing/Building**: Every time you complete a significant feature, refactor, or fix a tricky bug, you MUST append an entry to `CHANGES.md`.
3. **Format for CHANGES.md**:
   * **Date & Context**: What was done.
   * **Core Functions Touched**: List critical functions or architectural paths modified (so we don't forget their purpose).
   * **Pitfalls & Solutions (Crucial)**: If you encountered a bug, a circular dependency, or a test failure during your work, document *why* it happened and *how* you fixed it. This prevents you (or other AI sessions) from making the exact same mistake in the future.

## ✍️ Coding Guidelines
* **Language**: All code, variables, comments, documentation, and commit messages MUST be in English.
* **Format**: Keep existing functionalities, license headers, and indentation exactly as they are to ensure clean diffing.
* **Dependencies**: If your solution requires a new npm package, explicitly state: `npm install <package-name>`. Be mindful that Korelate targets offline/air-gapped OT environments, so backend dependencies should be kept light, and frontend dependencies MUST be downloaded into `public/libs/`.
* **DOM Teardown**: When modifying Frontend Views (`public/view.*.js`), always ensure event listeners, timers, and heavy instances (Chart.js, Ace) are properly destroyed in the `unmount*View()` lifecycle functions to prevent memory leaks in the SPA.
* **Tool Manifest**: The file `public/ai_tools_manifest.json` is the Single Source of Truth (SSOT) for AI capabilities. Update it if you modify or add new AI tools in `core/engine/aiTools.js`.

## 🔄 Workflow for Commits & Updates
When finalizing a major feature or fix:
1. Update `package.json` version if appropriate.
2. Update `README.md` to reflect new capabilities or architecture changes.
3. Generate a concise, standard Git commit message in English explaining the *why* and *what* of the changes.

## ⌨️ Shell Execution Rules
When executing terminal commands to build or test the application, you operate under strict constraints to avoid blocking the session:
1. **DO NOT run persistent processes**: Never run `node server.js`, `npm start`, or `docker-compose up`.
2. **DO NOT run interactive commands**: Always use flags like `-y`, `--force`, or `CI=true` to bypass prompts.
3. **Safe Commands**: You are auto-authorized to use `repomix`, `cat`, `ls`, `grep`, `git status/diff`, and the test commands (`jest`, `playwright` in headless mode). 
4. If a task requires restarting the

 server to see changes, modify the code, run the tests, update `CHANGES.md`, and instruct the user to restart the server manually.


 <!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
