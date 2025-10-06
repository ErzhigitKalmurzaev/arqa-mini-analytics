import { order_statuses } from '../../utils/constants'
import Badge from './Badge'

export default function StatusBadge({ status }: { status: number }) {
  let classes = 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
  if (status === 1) {
    classes = 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300'
  } else if (status === 2) {
    classes = 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300'
  } else if (status === 3) {
    classes = 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300'
  }
  return <Badge className={classes}>{order_statuses?.find(el => el.value === status)?.label}</Badge>
}


