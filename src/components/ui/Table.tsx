export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        {children}
      </table>
    </div>
  )
}
export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 sticky">{children}</thead>
}
export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-200 dark:divide-gray-800">{children}</tbody>
}
export function TR({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <tr onClick={onClick} className={`odd:bg-white even:bg-gray-50/60 dark:odd:bg-gray-950 dark:even:bg-gray-900/40 hover:bg-gray-50/80 dark:hover:bg-gray-900/70 ${className || ''}`}>{children}</tr>
}
export function TH({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 font-semibold">{children}</th>
}
export function TD({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2">{children}</td>
}


