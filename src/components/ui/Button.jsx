import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonClass = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-black text-white hover:bg-zinc-800',
        gradient: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white shadow-lg shadow-pink-200',
        outline: 'border border-zinc-200 bg-white text-black hover:bg-zinc-50',
        ghost: 'bg-transparent text-black hover:bg-white/60',
      },
      size: {
        default: 'h-11 px-5',
        icon: 'h-11 w-11',
        sm: 'h-9 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = ({ className, variant, size, ...props }) => {
  return <button className={cn(buttonClass({ variant, size }), className)} {...props} />
}

export default Button
