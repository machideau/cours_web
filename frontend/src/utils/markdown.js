import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'

const renderer = new marked.Renderer()
renderer.code = function({ text, lang }) {
  const validLang = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = validLang === 'plaintext'
    ? hljs.highlightAuto(text).value
    : hljs.highlight(text, { language: validLang }).value
  return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`
}

marked.use({ renderer })
marked.use(markedKatex({
  throwOnError: false,
  output: 'html'
}))

export function parseCourseMarkdown(content) {
  if (!content) return ''

  let html = marked.parse(content)

  html = html.replace(/<h2>(.*?)<\/h2>/g, (match, title) => {
    const cleanTitle = title.replace(/<[^>]*>/g, '').replace(/[*_`]/g, '').trim()
    const id = cleanTitle
      .toLowerCase()
      .replace(/[^\w\s\u00C0-\u00FF-]/g, '')
      .replace(/[\s-]+/g, '-')
    return `<h2 id="${id}">${title}</h2>`
  })

  html = html.replace(/<blockquote>\s*<p>\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*/gi, (match, type) => {
    const typeLower = type.toLowerCase()
    const titles = {
      note: 'Note',
      tip: 'Astuce',
      warning: 'Attention',
      important: 'Important'
    }
    return `<div class="callout callout-${typeLower}"><div class="callout-header"><span class="callout-title">${titles[typeLower]}</span></div><div class="callout-body"><p>`
  }).replace(/<\/p>\s*<\/blockquote>/gi, '</p></div></div>')

  return html
}
