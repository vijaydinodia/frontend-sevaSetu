import React from 'react'
import { cn } from '../../lib/utils'

const Card = ({ className, ...props }) => {
  return <div className={cn('rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm transition-all duration-200', className)} {...props} />
}

export default Card
