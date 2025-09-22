export type CsvRow = Record<string, string | number | boolean | null | undefined>

export type CsvOptions = {
  delimiter?: string
  crlf?: boolean
  bom?: boolean
  headerLabels?: Record<string, string>
}

export function downloadCsv(filename: string, rows: CsvRow[], headers?: string[], options: CsvOptions = {}) {
  if (!rows.length) return
  const keys = headers && headers.length ? headers : Array.from(new Set(rows.flatMap(r => Object.keys(r))))
  const delimiter = options.delimiter ?? ','
  const eol = options.crlf ? '\r\n' : '\n'
  const escape = (val: unknown) => {
    if (val === null || val === undefined) return ''
    const s = String(val)
    const needsQuote = s.includes('"') || s.includes(delimiter) || s.includes('\n') || s.includes('\r')
    const escaped = s.replace(/"/g, '""')
    return needsQuote ? '"' + escaped + '"' : escaped
  }
  const headerLine = keys.map(k => escape(options.headerLabels?.[k] ?? k)).join(delimiter)
  const dataLines = rows.map(r => keys.map(k => escape(r[k])).join(delimiter))
  const content = [headerLine, ...dataLines].join(eol)
  const prefix = options.bom ? '\uFEFF' : ''
  const blob = new Blob([prefix + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}


