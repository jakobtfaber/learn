import assert from 'node:assert/strict'
import { callExa } from '../extensions/exa-search/client.mjs'

const search = await callExa('web_search_exa', {
  query: 'Mermaid official flowchart documentation nodes edges',
  numResults: 2,
})
assert.ok(!search.isError, 'Exa search must succeed')
const searchText = search.content.filter(c => c.type === 'text').map(c => c.text).join('\n')
const url = searchText.match(/^URL: (https?:\/\/\S+)/m)?.[1]
assert.ok(url, 'Search must return a source URL')
const page = await callExa('web_fetch_exa', { urls: [url], maxCharacters: 3000 })
assert.ok(!page.isError, 'Exa fetch must succeed')
assert.ok(page.content.some(c => c.type === 'text' && c.text.length > 200), 'Fetch must return page content')
console.log(`PASS: searched Exa and fetched returned source ${url}`)
