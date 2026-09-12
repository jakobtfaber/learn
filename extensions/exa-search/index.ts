import type { ExtensionAPI } from '@earendil-works/pi-coding-agent'
import { Type } from '@sinclair/typebox'
import { callExa } from './client.mjs'
import { fileURLToPath } from 'node:url'

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: 'web_search',
    label: 'Exa Search',
    description: 'Search the web through the existing Exa MCP service. Returns source URLs and relevant page excerpts. Use web_fetch to read a returned source before synthesizing a factual answer.',
    parameters: Type.Object({
      query: Type.String({ minLength: 1 }),
      count: Type.Optional(Type.Integer({ minimum: 1, maximum: 10 })),
    }),
    async execute(_id, params, signal) {
      return await callExa('web_search_exa', { query: params.query, numResults: params.count ?? 5 }, signal) as any
    },
  })
  pi.registerTool({
    name: 'web_fetch',
    label: 'Exa Fetch',
    description: 'Read one public HTTP(S) webpage through Exa as clean text. Use a URL from search results and cite the source in your answer.',
    parameters: Type.Object({
      url: Type.String({ pattern: '^https?://' }),
      maxCharacters: Type.Optional(Type.Integer({ minimum: 1, maximum: 20_000 })),
    }),
    async execute(_id, params, signal) {
      const url = new URL(params.url)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP(S) URLs are supported')
      return await callExa('web_fetch_exa', { urls: [url.href], maxCharacters: params.maxCharacters ?? 6000 }, signal) as any
    },
  })
  pi.on('session_start', () => {
    const api = (globalThis as any).__pi_interactive_subagents
    const extension = fileURLToPath(import.meta.url)
    api?.registerToolExtension('web_search', extension)
    api?.registerToolExtension('web_fetch', extension)
  })
}
