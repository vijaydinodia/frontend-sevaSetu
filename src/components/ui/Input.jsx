import React from 'react'
import { cn } from '../../lib/utils'

const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-input)] px-4 text-sm text-[var(--text-main)] outline-none transition placeholder:text-zinc-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100/20',
        className,
      )}
      {...props}
    />
  )
}

export default Input
