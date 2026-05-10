'use client'

import { useMemo, useState } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { createBulkEmployeesAction } from '@/app/actions/admin/employees/create-employees'
import { employeeRowSchema } from '@/app/types/admin/schemas/employee-schema'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  departmentId: number
  groups: GroupResponse[]
  onClose: () => void
}

interface ImportedEmployeeRow {
  name: string
  email: string
  password: string
  role: 'USER' | 'ADMINISTRATOR' | string
  group_id?: string
}

interface PreviewRow {
  rowNumber: number
  data: ImportedEmployeeRow
  errors: string[]
}

const REQUIRED_HEADERS = ['name', 'email', 'password', 'role', 'group_id']

function normalizeRow(row: Record<string, unknown>): ImportedEmployeeRow {
  return {
    name: String(row.name ?? '').trim(),
    email: String(row.email ?? '').trim().toLowerCase(),
    password: String(row.password ?? ''),
    role: String(row.role ?? '').trim(),
    group_id:
      row.group_id === undefined || row.group_id === null
        ? ''
        : String(row.group_id).trim(),
  }
}

function parseCsv(text: string): ImportedEmployeeRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    throw new Error('El CSV debe tener cabecera y al menos una fila de datos')
  }

  const headers = lines[0].split(',').map((header) => header.trim())

  const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header))

  if (missingHeaders.length > 0) {
    throw new Error(`Faltan columnas obligatorias: ${missingHeaders.join(', ')}`)
  }

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim())
    const rawRow: Record<string, string> = {}

    headers.forEach((header, index) => {
      rawRow[header] = values[index] ?? ''
    })

    return normalizeRow(rawRow)
  })
}

function parseJson(text: string): ImportedEmployeeRow[] {
  const parsed = JSON.parse(text)

  if (!Array.isArray(parsed)) {
    throw new Error('El JSON debe ser un array de empleados')
  }

  return parsed.map((row) => normalizeRow(row as Record<string, unknown>))
}

function buildPreview(rows: ImportedEmployeeRow[], groups: GroupResponse[]): PreviewRow[] {
  const emailCounts = new Map<string, number>()
  const groupIds = new Set(groups.map((group) => String(group.id)))

  rows.forEach((row) => {
    if (!row.email) return
    emailCounts.set(row.email, (emailCounts.get(row.email) ?? 0) + 1)
  })

  return rows.map((row, index) => {
    const errors: string[] = []
    const parsed = employeeRowSchema.safeParse(row)

    if (!parsed.success) {
      errors.push(
        ...parsed.error.issues.map((issue) => {
          const field = issue.path[0]

          if(field === 'role'){
            return 'Rol inválido. Usa USER o ADMINISTRATOR'
          }

          if(field === 'email') {
            return issue.message === 'Invalid email'
            ? 'Email inválido'
            : issue.message
          }

          if(field === 'name'){
            return 'El nombre es obligatorio'
          }

          if(field === 'group_id'){
            return 'Grupo inválido'
          }

          return issue.message
        }),
      )
    }

    if (row.email && (emailCounts.get(row.email) ?? 0) > 1) {
      errors.push('Email duplicado en el fichero')
    }

    if (row.group_id && !groupIds.has(row.group_id)) {
      errors.push('El grupo indicado no existe en este departamento')
    }

    return {
      rowNumber: index + 2,
      data: row,
      errors,
    }
  })
}

export default function ImportEmployeesForm({ departmentId, groups, onClose }: Props) {
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([])
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)

  const validRows = useMemo(
    () => previewRows.filter((row) => row.errors.length === 0),
    [previewRows],
  )

  const invalidRows = useMemo(
    () => previewRows.filter((row) => row.errors.length > 0),
    [previewRows],
  )

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    setError('')
    setSuccess('')
    setPreviewRows([])

    if (!file) return

    setFileName(file.name)

    try {
      const text = await file.text()
      const lowerName = file.name.toLowerCase()

      const rows = lowerName.endsWith('.json')
        ? parseJson(text)
        : lowerName.endsWith('.csv')
          ? parseCsv(text)
          : (() => {
              throw new Error('Formato no soportado. Usa CSV o JSON')
            })()

      const preview = buildPreview(rows, groups)
      setPreviewRows(preview)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al leer el fichero')
    }
  }

  async function handleImport() {
    setError('')
    setSuccess('')

    if (validRows.length === 0) {
      setError('No hay filas válidas para importar')
      return
    }

    setPending(true)

    const result = await createBulkEmployeesAction(
      departmentId,
      validRows.map((row) => row.data),
    )

    setPending(false)

    if (result && 'error' in result) {
      setError(result.error)
      return
    }

    setSuccess(result?.success ?? 'Empleados importados correctamente')
    onClose()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-dashed border-divider bg-bg px-5 py-6 flex flex-col items-center justify-center gap-3 text-center">
        <Upload className="w-8 h-8 text-primary" />

        <div>
          <p className="text-sm font-bold text-text-primary">
            Selecciona un fichero CSV o JSON
          </p>
          <p className="text-xs text-text-hint mt-1">
            Columnas esperadas: name, email, password, role, group_id
          </p>
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

      {success && (
        <p className="text-sm text-success bg-success/10 border border-success/30 rounded-xl px-4 py-3">
          {success}
        </p>
      )}

      {previewRows.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-divider bg-bg px-4 py-3">
              <p className="text-xs text-text-hint">Total filas</p>
              <p className="text-lg font-bold text-text-primary">{previewRows.length}</p>
            </div>

            <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3">
              <p className="text-xs text-success">Válidas</p>
              <p className="text-lg font-bold text-success">{validRows.length}</p>
            </div>

            <div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3">
              <p className="text-xs text-error">Con errores</p>
              <p className="text-lg font-bold text-error">{invalidRows.length}</p>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-2xl border border-divider">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-surface border-b border-divider">
                <tr className="text-left text-text-hint">
                  <th className="px-4 py-3">Fila</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Grupo</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.rowNumber} className="border-b border-divider/50">
                    <td className="px-4 py-3 text-text-hint">{row.rowNumber}</td>
                    <td className="px-4 py-3 text-text-primary">{row.data.name || '-'}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.data.email || '-'}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.data.role || '-'}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.data.group_id || 'Sin grupo'}</td>
                    <td className="px-4 py-3">
                      {row.errors.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-success">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correcta
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

          <Button
            onClick={handleImport}
            disabled={pending || validRows.length === 0}
            className="w-full rounded-2xl h-11"
          >
            {pending
              ? 'Importando...'
              : `Importar ${validRows.length} empleado${validRows.length === 1 ? '' : 's'}`}
          </Button>
        </div>
      )}
    </div>
  )
}