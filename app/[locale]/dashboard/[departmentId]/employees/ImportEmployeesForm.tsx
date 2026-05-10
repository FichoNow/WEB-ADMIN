'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, FileText, AlertTriangle, CheckCircle2, Download } from 'lucide-react'
import { createBulkEmployeesAction } from '@/app/actions/admin/employees/create-employees'
import { employeeRowSchema } from '@/app/types/admin/schemas/employee-schema'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  departmentId: number
  groups: GroupResponse[]
  existingEmails: string[]
  onClose: () => void
}

interface ImportedEmployeeRow {
  name: string
  email: string
  password: string
  role: string
  group: string
}

interface PreviewRow {
  rowNumber: number
  data: ImportedEmployeeRow
  resolvedGroupId: string
  errors: string[]
}

const REQUIRED_HEADERS = ['name', 'email', 'password', 'role'] as const
const OPTIONAL_HEADERS = ['group'] as const

const TEMPLATE_ROWS: ImportedEmployeeRow[] = [
  { name: 'Juan García',  email: 'juan@empresa.com', password: '12345678', role: 'USER',          group: 'Marketing' },
  { name: 'Ana López',    email: 'ana@empresa.com',  password: '12345678', role: 'ADMINISTRATOR', group: '' },
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

interface ParseResult {
  rows: ImportedEmployeeRow[]
  error?: { key: string; values?: Record<string, string> }
}

function parseCsv(text: string): ParseResult {
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

function parseJson(text: string): ParseResult {
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

function buildCsvTemplate(): string {
  const headers = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS]
  const rows = TEMPLATE_ROWS.map((row) =>
    headers.map((h) => csvEscape(row[h as keyof ImportedEmployeeRow])).join(','),
  )
  return [headers.join(','), ...rows].join('\n')
}

function buildJsonTemplate(): string {
  return JSON.stringify(TEMPLATE_ROWS, null, 2)
}

function downloadFile(filename: string, mime: string, content: string) {
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

export default function ImportEmployeesForm({
  departmentId,
  groups,
  existingEmails,
  onClose,
}: Props) {
  const t = useTranslations('importEmployees')
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([])
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [formatTab, setFormatTab] = useState<'csv' | 'json'>('csv')

  const groupsByName = useMemo(() => {
    const map = new Map<string, number>()
    groups.forEach((g) => map.set(g.name.toLowerCase(), g.id))
    return map
  }, [groups])

  const existingEmailSet = useMemo(
    () => new Set(existingEmails.map((e) => e.toLowerCase())),
    [existingEmails],
  )

  function buildPreview(rows: ImportedEmployeeRow[]): PreviewRow[] {
    const emailCounts = new Map<string, number>()
    rows.forEach((row) => {
      if (!row.email) return
      emailCounts.set(row.email, (emailCounts.get(row.email) ?? 0) + 1)
    })

    return rows.map((row, index) => {
      const errors: string[] = []

      let resolvedGroupId = ''
      if (row.group) {
        const id = groupsByName.get(row.group.toLowerCase())
        if (id == null) {
          errors.push(t('errorGroupNotFound', { name: row.group }))
        } else {
          resolvedGroupId = String(id)
        }
      }

      const parsed = employeeRowSchema.safeParse({
        name:     row.name,
        email:    row.email,
        password: row.password,
        role:     row.role,
        group_id: resolvedGroupId,
      })

      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const field = issue.path[0]
          if (field === 'role')     { errors.push(t('errorRoleInvalid')); continue }
          if (field === 'email')    { errors.push(t('errorEmailInvalid')); continue }
          if (field === 'name')     { errors.push(t('errorNameRequired')); continue }
          if (field === 'password') { errors.push(t('errorPasswordShort')); continue }
          errors.push(issue.message)
        }
      }

      if (row.email && (emailCounts.get(row.email) ?? 0) > 1) {
        errors.push(t('errorEmailDuplicated'))
      }

      if (row.email && existingEmailSet.has(row.email)) {
        errors.push(t('errorEmailExists'))
      }

      return { rowNumber: index + 2, data: row, resolvedGroupId, errors }
    })
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    setError('')
    setPreviewRows([])

    if (!file) return

    setFileName(file.name)

    const text = await file.text().catch(() => null)
    if (text == null) {
      setError(t('errorReadFile'))
      return
    }

    const lower = file.name.toLowerCase()
    let result: ParseResult
    if (lower.endsWith('.json')) {
      result = parseJson(text)
    } else if (lower.endsWith('.csv')) {
      result = parseCsv(text)
    } else {
      setError(t('errorFormat'))
      return
    }

    if (result.error) {
      setError(t(result.error.key, result.error.values))
      return
    }

    setPreviewRows(buildPreview(result.rows))
  }

  const validRows = useMemo(
    () => previewRows.filter((row) => row.errors.length === 0),
    [previewRows],
  )

  const invalidRows = useMemo(
    () => previewRows.filter((row) => row.errors.length > 0),
    [previewRows],
  )

  async function handleImport() {
    setError('')

    if (validRows.length === 0) {
      setError(t('errorNoValid'))
      return
    }

    setPending(true)

    const result = await createBulkEmployeesAction(
      departmentId,
      validRows.map((row) => ({
        name:     row.data.name,
        email:    row.data.email,
        password: row.data.password,
        role:     row.data.role,
        group_id: row.resolvedGroupId,
      })),
    )

    setPending(false)

    if (result && 'error' in result) {
      setError(result.error)
      return
    }

    onClose()
  }

  function handleDownloadTemplate() {
    if (formatTab === 'csv') {
      downloadFile('plantilla-empleados.csv', 'text/csv;charset=utf-8', buildCsvTemplate())
    } else {
      downloadFile('plantilla-empleados.json', 'application/json;charset=utf-8', buildJsonTemplate())
    }
  }

  const jsonPreview = buildJsonTemplate()

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-divider bg-bg overflow-hidden">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-divider/60">
          <div>
            <h3 className="text-sm font-bold text-text-primary">{t('formatTitle')}</h3>
            <p className="text-xs text-text-hint mt-0.5">{t('formatHint')}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadTemplate}
            className="gap-2 rounded-xl h-9 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {t('downloadTemplate')}
          </Button>
        </header>

        <Tabs
          value={formatTab}
          onValueChange={(v) => setFormatTab(v as 'csv' | 'json')}
          className="px-5 py-4 flex flex-col gap-3"
        >
          <TabsList className="self-start">
            <TabsTrigger value="csv">{t('tabCsv')}</TabsTrigger>
            <TabsTrigger value="json">{t('tabJson')}</TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="mt-0">
            <div className="rounded-xl border border-divider/60 bg-surface overflow-x-auto">
              <table className="w-full text-[11px] font-mono border-collapse">
                <thead>
                  <tr>
                    <th className="w-8 bg-surface-variant/60 border-b border-r border-divider/60 text-text-hint font-medium px-2 py-1.5"></th>
                    {[...REQUIRED_HEADERS, ...OPTIONAL_HEADERS].map((header, i, arr) => (
                      <th
                        key={header}
                        className={`bg-surface-variant/60 border-b border-divider/60 text-text-secondary font-semibold text-left px-3 py-1.5 ${i < arr.length - 1 ? 'border-r' : ''}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEMPLATE_ROWS.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="w-8 bg-surface-variant/60 border-r border-divider/60 text-text-hint text-center px-2 py-1.5">
                        {rowIdx + 1}
                      </td>
                      {[...REQUIRED_HEADERS, ...OPTIONAL_HEADERS].map((header, i, arr) => (
                        <td
                          key={header}
                          className={`border-t border-divider/60 text-text-primary px-3 py-1.5 whitespace-nowrap ${i < arr.length - 1 ? 'border-r' : ''}`}
                        >
                          {row[header as keyof ImportedEmployeeRow]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="json" className="mt-0">
            <pre className="rounded-xl bg-surface border border-divider/60 px-4 py-3 text-[11px] text-text-secondary overflow-x-auto font-mono leading-relaxed">
{jsonPreview}
            </pre>
          </TabsContent>
        </Tabs>

        <div className="px-5 pb-5">
          <p className="text-[11px] font-semibold tracking-widest text-text-hint uppercase mb-2">
            {t('fields')}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-text-secondary">
            <li><code className="text-primary font-mono">{t('fieldName')}</code> — {t('fieldNameDesc')}</li>
            <li><code className="text-primary font-mono">{t('fieldEmail')}</code> — {t('fieldEmailDesc')}</li>
            <li><code className="text-primary font-mono">{t('fieldPassword')}</code> — {t('fieldPasswordDesc')}</li>
            <li><code className="text-primary font-mono">{t('fieldRole')}</code> — {t('fieldRoleDesc')}</li>
            <li className="sm:col-span-2"><code className="text-primary font-mono">{t('fieldGroup')}</code> — {t('fieldGroupDesc')}</li>
          </ul>
        </div>
      </section>

      <div className="rounded-2xl border border-dashed border-divider bg-bg px-5 py-6 flex flex-col items-center justify-center gap-3 text-center">
        <Upload className="w-8 h-8 text-primary" />

        <div>
          <p className="text-sm font-bold text-text-primary">{t('uploadTitle')}</p>
          <p className="text-xs text-text-hint mt-1">{t('uploadHint')}</p>
        </div>

        <Input
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="max-w-sm"
        />

        {fileName && (
          <p className="text-xs text-text-secondary flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            {fileName}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {previewRows.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-divider bg-bg px-4 py-3">
              <p className="text-xs text-text-hint">{t('summaryTotal')}</p>
              <p className="text-lg font-bold text-text-primary">{previewRows.length}</p>
            </div>

            <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3">
              <p className="text-xs text-success">{t('summaryValid')}</p>
              <p className="text-lg font-bold text-success">{validRows.length}</p>
            </div>

            <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3">
              <p className="text-xs text-error">{t('summaryInvalid')}</p>
              <p className="text-lg font-bold text-error">{invalidRows.length}</p>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-2xl border border-divider">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-surface border-b border-divider">
                <tr className="text-left text-text-hint">
                  <th className="px-4 py-3">{t('tableRow')}</th>
                  <th className="px-4 py-3">{t('tableName')}</th>
                  <th className="px-4 py-3">{t('tableEmail')}</th>
                  <th className="px-4 py-3">{t('tableRole')}</th>
                  <th className="px-4 py-3">{t('tableGroup')}</th>
                  <th className="px-4 py-3">{t('tableStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.rowNumber} className="border-b border-divider/50">
                    <td className="px-4 py-3 text-text-hint">{row.rowNumber}</td>
                    <td className="px-4 py-3 text-text-primary">{row.data.name || '-'}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.data.email || '-'}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.data.role || '-'}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.data.group || t('noGroup')}</td>
                    <td className="px-4 py-3">
                      {row.errors.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-success">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t('rowOk')}
                        </span>
                      ) : (
                        <span className="inline-flex items-start gap-1 text-error">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>{row.errors.join(', ')}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={pending}
          className="rounded-2xl h-11"
        >
          {t('cancel')}
        </Button>
        <Button
          type="button"
          onClick={handleImport}
          disabled={pending || validRows.length === 0}
          className="rounded-2xl h-11 sm:min-w-[200px]"
        >
          {pending
            ? t('importing')
            : validRows.length === 1
              ? t('importOne')
              : t('importMany', { count: validRows.length })}
        </Button>
      </div>
    </div>
  )
}
