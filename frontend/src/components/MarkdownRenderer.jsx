import React from 'react'

/**
 * Renders markdown-like text from the AI as formatted HTML.
 * Handles headings, bold, code, lists, and line breaks.
 */
export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null

  const lines = content.split('\n')
  const elements = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (line.trim() === '') {
      i++
      continue
    }

    // H1
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++}>{parseInline(line.slice(2))}</h1>)
      i++
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++}>{parseInline(line.slice(3))}</h2>)
      i++
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++}>{parseInline(line.slice(4))}</h3>)
      i++
      continue
    }

    // Unordered list items
    if (line.match(/^[-*]\s/)) {
      const items = []
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        items.push(<li key={i}>{parseInline(lines[i].slice(2))}</li>)
        i++
      }
      elements.push(<ul key={key++}>{items}</ul>)
      continue
    }

    // Ordered list items
    if (line.match(/^\d+\.\s/)) {
      const items = []
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        const text = lines[i].replace(/^\d+\.\s/, '')
        items.push(<li key={i}>{parseInline(text)}</li>)
        i++
      }
      elements.push(<ol key={key++}>{items}</ol>)
      continue
    }

    // Code block
    if (line.startsWith('```')) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      elements.push(
        <pre key={key++}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(<blockquote key={key++}>{parseInline(line.slice(2))}</blockquote>)
      i++
      continue
    }

    // Regular paragraph
    const paraLines = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].match(/^[-*]\s/) &&
      !lines[i].match(/^\d+\.\s/) &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('>')
    ) {
      paraLines.push(lines[i])
      i++
    }
    elements.push(<p key={key++}>{parseInline(paraLines.join(' '))}</p>)
  }

  return (
    <div className={`prose-studymate ${className}`}>
      {elements}
    </div>
  )
}

/**
 * Parse inline markdown: **bold**, `code`, *italic*
 */
function parseInline(text) {
  if (!text) return ''
  const parts = []
  // Split on **bold**, *italic*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let last = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    const token = match[0]
    if (token.startsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>)
    } else if (token.startsWith('`')) {
      parts.push(<code key={match.index}>{token.slice(1, -1)}</code>)
    }
    last = match.index + token.length
  }

  if (last < text.length) {
    parts.push(text.slice(last))
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
}

