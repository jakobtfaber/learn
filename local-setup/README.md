# Pi learning setup

Pi 0.85.1, using the original learn teaching and visualization skills with project-local compatibility fixes.

This is a snapshot of Jakob’s machine-specific setup. To reconstruct it, create `/Users/jakobfaber/Developer/scratch/2026-09/pi-learn/` and symlink its `.pi` to `/Users/jakobfaber/Developer/repos/github.com/amosblomqvist/learn/.worktrees/pi-setup`. Copy `local-setup/start.sh` into that scratch directory; the launcher requires the existing pi wrapper, subagent checkout, Exa launcher, and rendering tools described below.

Start a fresh teaching session:

```sh
tmux new -A -s pi-learn /Users/jakobfaber/Developer/scratch/2026-09/pi-learn/start.sh
```

Then enter `/skill:teach` followed by what you want to learn. For example: `/skill:teach Help me understand why fractions multiply the way they do.`

For readable notes, create a new Markdown file in this directory, then use `/md-log /absolute/path/to/note.md`. Use `/md-unlog` to stop. Linking now preserves existing note text and appends the session history; linking repeatedly repeats that history. To render the image embeds and math as intended, open this folder as an Obsidian vault.

The launcher loads only the learn skills, its tools, the original interactive-subagents implementation, and Exa search/fetch tools. Global pi settings and credentials remain in their existing authority. The model is the already configured `openai-codex/gpt-5.6-sol`; all three agents use it. Search and page retrieval use the existing Exa MCP server through `~/.local/bin/mcp-run exa`. Its existing managed launcher resolves the Exa credential from Keychain and passes it in the server process environment; no plaintext credential is stored here. Both main pi and the researcher use the same tools.

The `.pi` symlink targets the canonical learn repository's `pi-setup` Worktrunk checkout. Rendering dependencies are owned by its visual-tools package manifest/lockfile, installed with `PUPPETEER_SKIP_DOWNLOAD=1 npm ci --omit=dev --ignore-scripts`. Mermaid uses the existing Brave executable through `PUPPETEER_EXECUTABLE_PATH`; SVG uses the installed `rsvg-convert`.

Validation artifacts are disposable test notes and diagrams. The detached validation session is available with `tmux -L pi-learn-test attach -t learn`; use the fresh session command above for actual learning.

Exa bridge dependencies are owned by `.pi/extensions/exa-search/package.json` and its lockfile; restore them with `npm ci --prefix .pi/extensions/exa-search --ignore-scripts`. Run `node .pi/tests/exa-live.mjs` for a real search-then-fetch check. Restart an already-running learning session to load the new Exa tool mapping; the launch command is unchanged.
