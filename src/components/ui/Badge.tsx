import { cn } from '../../utils/cn'

export default function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', className)}>{children}</span>
}


