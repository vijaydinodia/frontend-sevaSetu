import React from 'react'
import { cn } from '../../lib/utils'

const Card = ({ className, ...props }) => {
  return <div className={cn('rounded-[28px] border border-white/70 bg-white shadow-sm', className)} {...props} />
}

export default Card
