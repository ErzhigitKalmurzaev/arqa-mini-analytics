export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-16 px-4 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-md">
        <h3 className="text-lg font-medium">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        ) : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  )
}


