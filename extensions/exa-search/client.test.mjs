import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { ChildProcess } from 'node:child_process'
import { callExa } from './client.mjs'

for (const [name, args] of [
  ['web_search_exa', { query: 'test query', numResults: 5 }],
  ['web_fetch_exa', { urls: ['https://example.com/'], maxCharacters: 6000 }],
]) {
  for (const [scenario, result, expectedError] of [
    ['service error', { isError: true, content: [{ type: 'text', text: 'Exa quota exceeded' }] }, 'Exa quota exceeded'],
    ['error without text', { isError: true, content: [] }, `Exa tool ${name} failed`],
    ['success', { content: [{ type: 'text', text: 'Source content' }] }, null],
  ]) {
    test(`${name}: ${scenario}`, async t => {
      t.mock.method(ChildProcess.prototype, 'spawn', () => { throw new Error('Unit tests must not spawn a process') })
      t.mock.method(Client.prototype, 'connect', async () => {})
      const request = t.mock.method(Client.prototype, 'callTool', async () => result)
      const close = t.mock.method(Client.prototype, 'close', async () => {})
      const signal = new AbortController().signal

      if (expectedError) {
        await assert.rejects(callExa(name, args, signal), { message: expectedError })
      } else {
        assert.strictEqual(await callExa(name, args, signal), result)
      }

      assert.deepEqual(request.mock.calls[0].arguments[0], { name, arguments: args })
      assert.strictEqual(request.mock.calls[0].arguments[2].signal, signal)
      assert.equal(close.mock.callCount(), 1)
    })
  }
}
