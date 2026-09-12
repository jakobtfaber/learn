import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { homedir } from 'node:os'
import { join } from 'node:path'

export async function callExa(name, args, signal) {
  const client = new Client({ name: 'learn-exa', version: '1.0.0' })
  const transport = new StdioClientTransport({
    command: join(homedir(), '.local/bin/mcp-run'),
    args: ['exa'],
    stderr: 'ignore',
  })
  try {
    await client.connect(transport, { signal, timeout: 30_000 })
    const result = await client.callTool({ name, arguments: args }, undefined, { signal, timeout: 60_000 })
    if (result.isError) {
      const message = result.content.filter(item => item.type === 'text').map(item => item.text).join('\n')
      throw new Error(message || `Exa tool ${name} failed`)
    }
    return result
  } finally {
    await client.close()
  }
}
