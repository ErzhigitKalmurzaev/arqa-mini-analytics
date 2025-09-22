import { cn } from '../../utils/cn.ts'
import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn('h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-900', className)}
      {...props}
    />
  )
}


