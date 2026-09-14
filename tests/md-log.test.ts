import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import mdLog from '../extensions/md-log.ts'

test('linking and live logging preserve existing note contents', async () => {
  const note = join(mkdtempSync(join(tmpdir(), 'learn-md-log-test-')), 'lesson.md')
  writeFileSync(note, 'KEEP_EXISTING_NOTE\n')
  const commands = new Map<string, any>()
  const events = new Map<string, any>()
  mdLog({ on: (n, f) => events.set(n, f), registerCommand: (n, c) => commands.set(n, c), appendEntry() {} } as any)
  const ctx = {
    cwd: tmpdir(), isIdle: () => true,
    sessionManager: { getEntries: () => [{ id: 'one', type: 'message', message: { role: 'user', content: 'HISTORY_MARKER' } }] },
    ui: { notify() {}, setStatus() {}, theme: { fg: (_c: string, t: string) => t } },
  }
  await commands.get('md-log').handler(note, ctx)
  await events.get('message_end')({ message: { role: 'user', content: 'LIVE_MARKER' } }, ctx)
  const text = readFileSync(note, 'utf8')
  assert.ok(text.startsWith('KEEP_EXISTING_NOTE\n'))
  assert.match(text, /HISTORY_MARKER/)
  assert.match(text, /LIVE_MARKER/)
})
