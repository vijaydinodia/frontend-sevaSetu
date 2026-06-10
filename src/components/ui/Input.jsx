import React from 'react'
import { cn } from '../../lib/utils'

const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100',
        className,
      )}
      {...props}
    />
  )
}

export default Input
