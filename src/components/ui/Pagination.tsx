type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div className="text-gray-600 dark:text-gray-300">Page {page} of {totalPages}</div>
      <div className="flex items-center gap-2">
        <button
          className="h-8 px-3 rounded border text-sm disabled:opacity-50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
        >
          Prev
        </button>
        <button
          className="h-8 px-3 rounded border text-sm disabled:opacity-50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  )
}


