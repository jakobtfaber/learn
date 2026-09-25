# Learn for Codex

Native Codex plugin. The separate local BB implementation is excluded from this
package. The native source is `learn/`, not the installed cache.
Its teaching skill preserves probe → plan → teach, prerequisite floors and
ceilings, balanced distractors, motivated discovery, and checks after every node.

## Use

Start a new Codex thread and enter:

```text
Use $learn to teach me why multiplying two negative numbers gives a positive number.
```

The plugin skill appears as `learn:learn`. Codex asks a diagnostic question,
waits for your answer, grades it, and adapts the next probe. After mapping your
starting point it presents a dependency map and waits for your go-ahead to teach.
Explicit requests to shorten or skip phases take precedence.

## Local installation on Jakob's Mac

- Source: `/Users/jakobfaber/Developer/repos/github.com/jakobtfaber/learn/codex-plugins/learn`
- Personal catalog: `/Users/jakobfaber/.agents/plugins/marketplace.json`
- Existing marketplace name preserved: `plugins-cli`
- Plugin ID: `learn@plugins-cli`
- Installed cache: inspect `codex plugin list --marketplace plugins-cli --json` for the current version.

The new catalog entry points directly to
`./Developer/repos/github.com/jakobtfaber/learn/codex-plugins/learn`, relative to
home. This uses the supported marketplace-root-relative path format and keeps
the repository authoritative without creating another top-level home folder.
The existing catalog entry and display name are preserved.

Install from the already configured personal catalog:

```sh
codex plugin add learn@plugins-cli
codex plugin list --marketplace plugins-cli --json
skillmap --check
```

For source updates, use the plugin-creator skill's
`scripts/read_marketplace_name.py`, then
`scripts/update_plugin_cachebuster.py <source-path>` and reinstall with the
same `codex plugin add` command. Start a new thread after reinstalling. Do not
edit the cache or copy this skill into a USER skill store.

Packaging reference: [official OpenAI plugin documentation](https://developers.openai.com/plugins/build/plugins).

## Capability boundaries

- Quizzes are graded conversationally after a reply. This package does not
  supply BB's quiz cards, buttons, automatic shuffling, or instant client-side
  scoring. Multi-select requires exactly the correct set; unknown and skipped
  answers remain distinct from incorrect guesses.
- Goal questions use a supported Codex input tool when permitted, or ordinary
  chat otherwise. No fictitious `quiz` or `ask_user_question` tool is registered.
- Research uses available Codex web/source tools. There is no bundled Exa/Tavily
  fan-out server, dependency installation, credential access, or new MCP service.
  If source verification is unavailable, the skill discloses that and narrows or
  defers the affected claim.
- Mermaid and LaTeX depend on the client renderer; text fallbacks are specified.
- Conversation state records lesson progress. A requested visual/executable lesson
  can use local editable artifacts; durable memory writes still require an explicit
  request. The plugin does not manage voice threads.

## Historical validation (2026-09-23)

Codex CLI 0.155.1:

- Plugin-creator `validate_plugin.py`: passed.
- Skill-creator `quick_validate.py`: passed.
- `codex plugin list`: installed and enabled, resolving the canonical source.
- Source manifest and skill match installed cache byte for byte.
- `skillmap --check`: passed after its approved `--reconcile` restored an
  unrelated missing browser-plugin skill payload. No Learn collision or shadow.
- Fresh `codex exec`, read-only sandbox and low reasoning, discovered `$learn`
  and read its installed cache skill without receiving its contents or path in
  the prompt. It asked one diagnostic distributivity question, withheld the
  answer, and waited. Test thread: `01a0cd1c-1297-7eb3-8d33-8b12df0b2ec3`.

- A resumed turn with the deliberately incorrect answer B correctly identified A,
  explained the distributivity error, and asked a narrower parentheses probe
  instead of prematurely advancing to the plan or lesson.

The final reinstall only trims inherited trailing whitespace and adds a cachebuster;
its manifest and skill again match the installed cache.

Desktop picker rendering and a complete human-led lesson have not been tested.
No remote publication was performed.

## Visual and executable lessons

During planning the teacher chooses a diagram, evolving notebook, or browser demo
when it helps, and the learner can override the choice. Visual nodes build through
motivation, setup, prediction, manipulation, explanation, and a graded check.
Results stay hidden until the learner answers a prediction. Existing notebook
cells and learner edits are preserved; figures and source stay in the lesson folder.

The optional launcher uses its locked Python environment for both Jupyter and the
kernel. It keeps Jupyter authentication enabled and binds to loopback. From the
`codex-plugins/` directory, for example:

```sh
uv run --locked learn/skills/learn/scripts/notebook.py /absolute/lesson/lesson.ipynb --init
uv run --locked learn/skills/learn/scripts/notebook.py /absolute/lesson/lesson.ipynb --check
uv run --locked learn/skills/learn/scripts/notebook.py /absolute/lesson/lesson.ipynb --open
```

`--init` refuses an existing file; `--check` uses a fresh kernel and writes a separate
executed copy, preserving the original. The teacher separately verifies execution,
visual appearance, and whether the notebook was actually opened, and embeds a
preview with an editable-source link in chat. Creating a file is not delivery proof.

Run the acceptance check from the repository root in an environment with JupyterLab,
Matplotlib, and nbclient installed:

```sh
python codex-plugins/tests/check_notebook.py
```

An optional empty output-directory argument retains the exponential-profile demonstration;
use a fresh directory for each run so existing artifacts are never overwritten.
The check exercises both equal-column and equal-midplane normalization, fractional
profile collapse, output retention, overwrite refusal, preservation of learner
source, and rejection of hidden kernel state. Inspect its figures separately.
