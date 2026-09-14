#!/bin/bash
set -euo pipefail
cd /Users/jakobfaber/Developer/scratch/2026-09/pi-learn
export PUPPETEER_EXECUTABLE_PATH='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
exec /Users/jakobfaber/bin/pi --no-extensions --no-skills --no-prompt-templates --no-context-files --approve --offline \
  --model openai-codex/gpt-5.6-sol --thinking low \
  --skill .pi/skills/teach --skill .pi/skills/visualize \
  -e /Users/jakobfaber/Developer/repos/github.com/amosblomqvist/pi-interactive-subagents/pi-extension/subagents/index.ts \
  -e .pi/extensions/ask-user-question.ts -e .pi/extensions/quiz.ts -e .pi/extensions/md-log.ts \
  -e .pi/extensions/visual-tools/index.ts -e .pi/extensions/exa-search/index.ts "$@"
