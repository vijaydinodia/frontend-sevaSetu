import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => {
  return twMerge(clsx(inputs))
}

export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return ''
  
  // Split the sentence into an array of words using a single space
  const words = str.split(' ')
  
  // Capitalize the first letter of each word and lowercase the rest
  const formattedWords = words.map(word => {
    if (word.length === 0) return '' // Handle multiple consecutive spaces
    
    const firstLetter = word.charAt(0).toUpperCase()
    const remainingLetters = word.slice(1).toLowerCase()
    
    return firstLetter + remainingLetters
  })
  
  // Join the formatted words back together into a single string, skipping any empty slots
  return formattedWords.filter(word => word !== '').join(' ')
}
