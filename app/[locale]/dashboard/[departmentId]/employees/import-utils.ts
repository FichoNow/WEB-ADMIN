export interface ImportedEmployeeRow {
  name: string
  email: string
  password: string
  role: string
  group: string
}

export interface ParseResult {
  rows: ImportedEmployeeRow[]
  error?: { key: string; values?: Record<string, string> }
}

export const REQUIRED_HEADERS = ['name', 'email', 'password', 'role'] as const
export const OPTIONAL_HEADERS = ['group'] as const

export const TEMPLATE_ROWS: ImportedEmployeeRow[] = [
  { name: 'Juan García', email: 'juan@empresa.com', password: '12345678', role: 'USER',          group: 'Marketing' },
  { name: 'Ana López',   email: 'ana@empresa.com',  password: '12345678', role: 'ADMINISTRATOR', group: '' },
]

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]

    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        current += ch
      }
    } else {
      if (ch === ',') {
        out.push(current)
        current = ''
      } else if (ch === '"' && current.length === 0) {
        inQuotes = true
      } else {
        current += ch
      }
    }
  }

  out.push(current)
  return out.map((v) => v.trim())
}

function normalizeRow(row: Record<string, unknown>): ImportedEmployeeRow {
  return {
    name:     String(row.name     ?? '').trim(),
    email:    String(row.email    ?? '').trim().toLowerCase(),
    password: String(row.password ?? ''),
    role:     String(row.role     ?? '').trim().toUpperCase(),
    group:    String(row.group    ?? '').trim(),
  }
}

export function parseCsv(text: string): ParseResult {
  const cleaned = stripBom(text)
  const lines = cleaned
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+$/, ''))
    .filter((line) => line.length > 0)

  if (lines.length < 2) {
    return { rows: [], error: { key: 'errorCsvHeaders' } }
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase())
  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h))

  if (missing.length > 0) {
    return { rows: [], error: { key: 'errorCsvMissing', values: { missing: missing.join(', ') } } }
  }

  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const raw: Record<string, string> = {}
    headers.forEach((header, index) => {
      raw[header] = values[index] ?? ''
    })
    return normalizeRow(raw)
  })

  return { rows }
}

export function parseJson(text: string): ParseResult {
  const cleaned = stripBom(text)
  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return { rows: [], error: { key: 'errorReadFile' } }
  }

  if (!Array.isArray(parsed)) {
    return { rows: [], error: { key: 'errorJsonArray' } }
  }

  for (const item of parsed) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      return { rows: [], error: { key: 'errorJsonObject' } }
    }
  }

  return { rows: parsed.map((row) => normalizeRow(row as Record<string, unknown>)) }
}

export function buildCsvTemplate(): string {
  const headers = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS]
  const rows = TEMPLATE_ROWS.map((row) =>
    headers.map((h) => csvEscape(row[h as keyof ImportedEmployeeRow])).join(','),
  )
  return [headers.join(','), ...rows].join('\n')
}

export function buildJsonTemplate(): string {
  return JSON.stringify(TEMPLATE_ROWS, null, 2)
}

export function downloadFile(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
