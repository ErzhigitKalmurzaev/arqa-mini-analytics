export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="flex justify-between items-center gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        {subtitle ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}


